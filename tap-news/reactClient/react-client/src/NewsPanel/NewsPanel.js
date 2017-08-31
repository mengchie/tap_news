import './NewsPanel.css';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';

import _ from 'lodash';

class NewsPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      news:null,
      pageNum:0
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    let scrollY = window.scrollY || window.pageYOffset
        || document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
      console.log('Loading more news...');
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    let url = 'http://localhost:8080/news/pageNum/' + this.state.pageNum;
    let request = new Request(encodeURI(url), {
      method: 'GET',
      // headers: {
      //   'Authorization': 'bearer ' + Auth.getToken(),
      // },
      cache: false
    });

    if(this.state.preLoadNews && this.state.preLoadNews.length >= 30) {

      let subArr = this.state.preLoadNews.slice(0, 30);
      this.setState({
        news: this.state.news ?
          this.state.news.concat(subArr) : subArr,
        preLoadNews: this.state.preLoadNews.slice(30, this.state.preLoadNews.length)
      });

    } else {
      fetch(request)
      .then((res) => res.json())
      .then((loadedNews) => {
        console.log('in loadedNews');
        this.setState({
          preLoadNews: this.state.preLoadNews ?
              this.state.preLoadNews.concat(loadedNews) : loadedNews,
        });
        let subArr = this.state.preLoadNews.slice(0, 30);
        this.setState({
          news: this.state.news ?
              this.state.news.concat(subArr) : subArr,
          preLoadNews: this.state.preLoadNews.slice(30, this.state.preLoadNews.length),
          pageNum: this.state.pageNum + 1
        });
          
      });
    }

  }

  renderNews() {
    const news_list = this.state.news.map(function(news) {
      return (
        <a className="list-group-item" href='#'>
          <NewsCard news={news} />
        </a>
      );
    });

    return (
      <div className="container-fluid">
        <div className='list-group'>
          {news_list}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.news) {
      return (
        <div>
          {this.renderNews()}
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

export default NewsPanel;
