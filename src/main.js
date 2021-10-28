import { createApp } from 'vue'
import App from './App.vue'

import mitt from 'mitt'

import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        filter: "all",
        todos: [
            {
                id: 1,
                title: "Finish Vue Screencast",
                completed: false,
                editing: false,
            },
            { id: 2, title: "Take over world", completed: false, editing: false },
        ],
    },
    getters: {
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
            return (
                state.todos.filter((todo) => todo.completed).length > 0
            );
        },
    },
    mutations: {
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: false,
                editing: false
            })
        },
        updateTodo(state, todo) {
            const index = state.todos.findIndex(
                (item) => item.id == todo.id
            );
            state.todos.splice(index, 1, {
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                editing: todo.editing,
            });
        },
        deleteTodo(state, id) {
            const index = state.todos.findIndex((item) => item.id == id);
            state.todos.splice(index, 1);
        },
        checkAllTodos(state, checked) {
            state.todos.forEach(
                (todo) => (todo.completed = checked)
            );
        },
        updateFilter(state, filter) {
            state.filter = filter;
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(
                (todo) => !todo.completed
            );
        },
    },
    actions: {
        addTodo(context, todo) {
            setTimeout(() => {
                context.commit('addTodo', todo);
            }, 100)
        },
        updateTodo(context, todo) {
            setTimeout(() => {
                context.commit('updateTodo', todo);
            }, 100)
        },
        deleteTodo(context, id) {
            setTimeout(() => {
                context.commit('deleteTodo', id);
            }, 100)
        },
        checkAllTodos(context, checked) {
            setTimeout(() => {
                context.commit('checkAllTodos', checked);
            }, 100)
        },
        updateFilter(context, filter) {
            setTimeout(() => {
                context.commit('updateFilter', filter);
            }, 100)
        },
        clearCompleted(context) {
            setTimeout(() => {
                context.commit('clearCompleted');
            }, 100)
        },
    }
})

const app = createApp(App);
app.config.globalProperties.$myBus = mitt()
app.use(store).mount('#app');
