<template>
    <div>
        <Navbar />
        <div class="app">
          <div class="app-header">
            <img src="https://s3.us-east-2.amazonaws.com/blix/logo.png" alt="blix" class="logo-small"/>
            <h1 class="app-title">Welcome to Blix</h1>
              <p class="app-intro">
              <a href="https://blixjs.com/" target="_blank" rel="noopener noreferrer">Automate all-the-things</a>
              </p>
          </div>
          <img src="https://s3.us-east-2.amazonaws.com/blix/gear.svg" class="app-logo" alt="logo"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
    components: {
        Navbar
    }
}
</script>

<style scoped>
.app {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-logo {
  animation: app-logo-spin infinite 55s linear;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: -1;
}

.logo-small {
  height: 50%;
}

.app-header {
  margin-top: 5%;
  height: 150px;
  padding: 20px;
}

.app-title {
  font-size: 1.5em;
}

.app-intro {
  font-size: large;
}

.app-intro a {
  color: black;
}

@keyframes app-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

