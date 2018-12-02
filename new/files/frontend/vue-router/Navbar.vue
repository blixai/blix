<template>
    <div id="navbar">
        <h3>
          <router-link to="/">Home</router-link>
        </h3>
        <ul>
          <li class="navbar-links">
            <router-link to="/about">About</router-link>
          </li>
          <li class="navbar-links">
            <router-link to="/contact">Contact</router-link>
          </li>
        </ul>
    </div> 
</template>

<style scoped>
#navbar {
  display: flex;
  justify-content: space-between;
  background: #4776e6;
  background: -webkit-linear-gradient(to right, #8e54e9, #4776e6);
  background: linear-gradient(to right, #8e54e9, #4776e6);
}

#navbar h3 {
  margin-left: 20px;
}

#navbar h3 a {
  text-decoration: none;
  color: white;
}

#navbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style-type: none;
  padding: 0 20px;
}

#navbar ul li a {
  padding: 10px;
  text-decoration: none;
  color: white;
}
</style>

