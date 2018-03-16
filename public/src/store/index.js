import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		joined: false,
		name: '',
		messages: [],
		roomData: {}
	},

	mutations: {
		setJoined(state, payload) {
			state.joined = payload.joined;
			state.name = payload.name;
		}
	},

	actions: {
		setJoined({ commit, dispatch }, payload) {
			commit('setJoined', payload);
		},
	}


});