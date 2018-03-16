import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);



//
import io from 'socket.io-client'
let socket = {}

export default new Vuex.Store({
	state: {
		joined: false,
		name: '',
		messages: [],
		roomData: {}
	},

	mutations: {
		setJoined(state, payload) {
			state.joined = true
			state.name = payload;
		},
		setRoom(state, payload){
			state.roomData = payload
		},
		newUser(state, payload){
			Vue.set(state.roomData.connectedUsers, payload.userName, payload.userName)
		},
		userLeft(state, payload){
			Vue.set(state.roomData.connectedUsers, payload, undefined)
		},
		addMessage(state, payload){
			state.messages.push(payload)
		},
		leave(state){
			state.joined= false,
			state.name= '',
			state.messages= [],
			state.roomData= {}
		}
	},

	actions: {
		join({ commit, dispatch }, payload) {
			commit('setJoined', payload);
			dispatch('socket', payload)
		},
		socket({ commit, dispatch}, payload){
			//establish connection with socket
			socket = io('//localhost:3000')

			socket.on('CONNECTED', data=>{
				console.log('Connected to socket')
				//connect to room 
				socket.emit('join', {name: payload})
			})

			socket.on('joinedRoom', data=>{
				commit('setRoom', data)
			})

			socket.on('newUser', data=>{
				commit('newUser', data)
			})

			socket.on('left', data=>{
				console.log('user left', data)
				commit('userLeft', data)
			})

			socket.on('newMessage', data=>{
				commit('addMessage', data)
			})
		},
		sendMessage({commit, dispatch}, payload){
			socket.emit('message', payload)
		},
		leaveRoom({commit, dispatch}, payload){
			socket.emit('leave')
			socket.close()
			commit('leave')
		}
	}


});