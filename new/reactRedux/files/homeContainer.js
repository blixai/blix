import { connect } from 'react-redux'
import Home from './Home'

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(Home)