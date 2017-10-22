import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as mutations from './muatations'
import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * Array of {done: {bool}, comments: {String[]})
         */
        stage: 'loading',
        discussions: [],
        longestDiscsussion: 0,
        commentsDone: true,
        allDone: false,
        comments: {
            ok: [],
            offensive: []
        },
        cursor: {
            discussion: 0,
            idx: 0
        }
    },
    getters,
    actions,
    mutations
})

export default store