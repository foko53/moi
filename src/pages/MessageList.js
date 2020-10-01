import React from "react";
import Menu from "../components/menu/Menu";
import Api from "../pages/dataService";
import { userIsAuthenticated } from "../redux/HOCs";
import Message from "../components/message/Message";
import debounce from "lodash.debounce";

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Api();
    this.state = {
      messages: [],
      error: false,
      hasMore: true,
      isLoading: false,
    };
    window.onscroll = debounce(() => {
      const {
        loadMessages,
        state: { error, isLoading, hasMore },
      } = this;

      if (error || isLoading || !hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMessages();
      }
    }, 100);
  }

  componentDidMount() {
    this.loadMessages();
  }

  pullMessages() {
    return this.client.getMessages();
  }

  loadMessages = () => {
    this.setState({ isLoading: true }, () => {
      this.pullMessages().then((response) => {
        const messageList = response.messages;
        if (messageList) {
          const nextMessages = response.messages.map((messageObject) => {
            return (
              <Message
                messageId={messageObject.id}
                key={messageObject.id}
                {...messageObject}
              />
            );
          });

          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: this.state.messages.length < 100,
            isLoading: false,
            messages: [this.state.messages, nextMessages],
          });

          console.log(response);
        }
      });
    });
  };

  render() {
    const { error, hasMore, isLoading, messages } = this.state;

    if (messages.length === 0) {
      return (
        <div className="MessageList">
          <Menu isAuthenticated={this.props.isAuthenticated} />
          <h1>MessageList</h1>
          <h3>LOADING...</h3>
        </div>
      );
    }
    return (
      <div className="MessageList">
        <Menu isAuthenticated={this.props.isAuthenticated} />
        <h1>Message Feed</h1>
        <ul>
          {messages.map((messageObject) => {
            return (
              <Message
                messageId={messageObject.id}
                key={messageObject.id}
                {...messageObject}
              />
            );
          })}
        </ul>
        {error && <div style={{ color: "#900" }}>{this.state.error}</div>}
        {isLoading && <div>Loading...</div>}
        {!hasMore && <div>You did it! You reached the end!</div>}
      </div>
    );
  }
}

export default userIsAuthenticated(MessageList);
