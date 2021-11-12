import { createStore } from "vuex";

import { collection, getDocs } from "firebase/firestore";
import { doc, addDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import db from "./firebase";

const store = createStore({
  state: {
    token: localStorage.getItem("accessToken") || null,
    uid: null,
    loading: true,
    filter: "all",
    todos: [],
  },
  getters: {
    loggedIn(state) {
      return state.token != null;
    },
    remaining(state) {
      return state.todos.filter((todo) => !todo.completed).length;
    },
    anyRemaining(state, getters) {
      return getters.remaining != 0;
    },
    todosFiltered(state) {
      if (state.filter == "all") {
        return state.todos;
      } else if (state.filter == "active") {
        return state.todos.filter((todo) => !todo.completed);
      } else if (state.filter == "completed") {
        return state.todos.filter((todo) => todo.completed);
      }
      return state.todos;
    },
    showClearCompletedButton(state) {
      return state.todos.filter((todo) => todo.completed).length > 0;
    },
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push({
        id: todo.id,
        title: todo.title,
        completed: false,
        editing: false,
      });
    },
    updateTodo(state, todo) {
      const index = state.todos.findIndex((item) => item.id == todo.id);
      state.todos.splice(index, 1, {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        editing: todo.editing,
      });
    },
    deleteTodo(state, id) {
      const index = state.todos.findIndex((item) => item.id == id);
      if (index >= 0) {
        state.todos.splice(index, 1);
      }
    },
    checkAllTodos(state, checked) {
      state.todos.forEach((todo) => (todo.completed = checked));
    },
    updateFilter(state, filter) {
      state.filter = filter;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    retrieveTodos(state, todos) {
      state.todos = todos;
    },
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
    clearTodos(state) {
      state.todos = [];
    },
  },
  actions: {
    clearTodos(context) {
      context.commit("clearTodos");
    },
    destroyToken(context) {
      const auth = getAuth();

      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          signOut(auth)
            .then((response) => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("accessUid");
              context.commit("destroyToken");
              resolve(response);
            })
            .catch((error) => {
              console.log(error);
              localStorage.removeItem("accessToken");
              context.commit("destroyToken");
              reject(error);
            });
        });
      }
    },
    retrieveToken(context, credentials) {
      let email = credentials.email;
      let password = credentials.password;
      const auth = getAuth();

      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((response) => {
            const token = response.user.accessToken;
            const uid = response.user.uid;

            localStorage.setItem("accessToken", token);
            localStorage.setItem("accessUid", uid);
            context.commit("retrieveToken", token);

            resolve(response);
          })
          .catch((error) => {
            console.log(error);

            reject(error);
          });
      });
    },
    registerAccount(context, credentials) {
      let email = credentials.email;
      let password = credentials.password;
      const auth = getAuth();
      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    initRealtimeListeners(context) {
      const uid = localStorage.getItem("accessUid");
      onSnapshot(
        query(collection(db, "todos"), where("uid", "==", uid)),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const source = change.doc.metadata.hasPendingWrites
                ? "Local"
                : "Server";

              if (source === "Server") {
                context.commit("addTodo", {
                  id: change.doc.id,
                  title: change.doc.data().title,
                  completed: false,
                });
              }
            }
            if (change.type === "modified") {
              context.commit("updateTodo", {
                id: change.doc.id,
                title: change.doc.data().title,
                completed: change.doc.data().completed,
              });
            }
            if (change.type === "removed") {
              context.commit("deleteTodo", change.doc.id);
            }
          });
        }
      );
    },
    retrieveTodos(context) {
      const uid = localStorage.getItem("accessUid");
      context.state.loading = true;

      getDocs(query(collection(db, "todos"), where("uid", "==", uid))).then(
        (querySnapshot) => {
          let tempTodos = [];
          querySnapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              title: doc.data().title,
              completed: doc.data().completed,
              timestamp: doc.data().timestamp,
            };

            tempTodos.push(data);
          });

          context.state.loading = false;

          const tempTodosSorted = tempTodos.sort((a, b) => {
            return a.timestamp.seconds - b.timestamp.seconds;
          });

          context.commit("retrieveTodos", tempTodosSorted);
        }
      );
    },
    addTodo(context, todo) {
      const uid = localStorage.getItem("accessUid");

      addDoc(collection(db, "todos"), {
        uid: uid,
        id: todo.id,
        title: todo.title,
        completed: false,
        timestamp: new Date(),
      }).then((docRef) => {
        context.commit("addTodo", {
          id: docRef.id,
          title: todo.title,
          completed: false,
        });
      });
    },
    updateTodo(context, todo) {
      const docRef = doc(db, "todos", todo.id);

      setDoc(
        docRef,
        {
          title: todo.title,
          completed: todo.completed,
        },
        {
          merge: true,
        }
      ).then(() => {
        context.commit("updateTodo", todo);
      });
    },
    deleteTodo(context, id) {
      deleteDoc(doc(db, "todos", id)).then(() => {
        context.commit("deleteTodo", id);
      });
    },
    checkAllTodos(context, checked) {
      const uid = localStorage.getItem("accessUid");

      getDocs(query(collection(db, "todos"), where("uid", "==", uid))).then(
        (querySnapshot) => {
          querySnapshot.forEach((docRef) => {
            updateDoc(docRef.ref, {
              completed: checked,
            }).then(() => {
              context.commit("checkAllTodos", checked);
            });
          });
        }
      );
    },
    updateFilter(context, filter) {
      context.commit("updateFilter", filter);
    },
    clearCompleted(context) {
      const uid = localStorage.getItem("accessUid");

      getDocs(
        query(
          collection(db, "todos"),
          where("completed", "==", true),
          where("uid", "==", uid)
        )
      ).then((querySnapshot) => {
        querySnapshot.forEach((docRef) => {
          deleteDoc(docRef.ref).then(() => {
            context.commit("clearCompleted");
          });
        });
      });
    },
  },
});

export default store;
