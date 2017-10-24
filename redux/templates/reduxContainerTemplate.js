import { connect } from 'react-redux'
import Name from './Name'

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(Name)