type State = {
  title: ?string,
  titleBase: ?string,
  description: ?string,
  statusCode: ?number
};

class HelmetStore {

  constructor() {
    this.bindActions(this.alt.getActions('helmet'))

    this.state = {
      title: '',
      titleBase: 'Sliced - ',
      description: 'Product Recommendations',
      statusCode: 200
    }
  }

  onUpdate(props: State) {
    this.setState({ ...this.state, ...props })
  }

}

export default HelmetStore
