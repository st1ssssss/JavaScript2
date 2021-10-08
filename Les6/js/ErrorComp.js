Vue.component('error-box', {
    data() {
        return {
            error: ''
        }
    },

    methods: {
        setError(errorText) {
            this.error = errorText
        }
    },

    computed: {
        isVisible() {
            return this.error !== ''
        }
    },

    template: `
        <div class="error-box" v-if="isVisible"> 
        <p>{{error}}</p>
        <button class="close-btn" @click="setError('')">Close</button>
        
        </div>
    `

})