import { connect } from 'react-redux'
import Navbar from './Navbar'

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(Navbar)