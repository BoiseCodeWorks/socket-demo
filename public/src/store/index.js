import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

//socket stuff
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
			state.joined = payload.joined;
			state.name = payload.name;
		},
		addMessage(state, payload) {
			state.messages.push(payload);
		},
		clearMessages(state) {
			state.messages = [];
		},
		createRoom(state, payload){
			state.roomData = payload
		},
		addUser(state, payload){
			Vue.set(state.roomData.connectedUsers, payload, payload)
		},
		removeUser(state, payload){
			Vue.set(state.roomData.connectedUsers, payload, undefined)
		}
	},

	actions: {
		//creates local user and inititiates socket connection
		setJoined({ commit, dispatch }, payload) {
			commit('setJoined', payload);
			dispatch('initSocket', payload)
		},
		//Creates Socket Connection and Manages inbound Messages
		initSocket({ commit, dispatch }, payload) {
			//sends connection request to server
			socket = io('//localhost:3000')

			//listens for server response to connection
			socket.on('CONNECTED', data=>{
				console.log(data.message)
				//joins specific room
				socket.emit('join', payload.name)
			}),

			//listens for confirmation of joining room
			socket.on('joinedRoom', data=>{
				commit('createRoom', data)
			})

			//listens for new users joining room
			socket.on('newUser', data=>{
				commit('addUser', data)
			})

			//listens for messages posted to the room
			socket.on('message', data=>{
				commit('addMessage', data);
			})
			
			//listens for users disconnecting from the room
			socket.on('left', data=>{
				commit('removeUser', data)
			})
		},


		//send message over socket connection
		sendMessage({ commit, dispatch }, payload) {
			socket.emit('message', payload)
		},

		//send close socket connection
		leaveRoom({ commit, dispatch }) {
			socket.emit('leave')
			socket.close()
			commit('clearMessages')
			commit('setJoined', {joined: false, name: ''})
		}
	}


});