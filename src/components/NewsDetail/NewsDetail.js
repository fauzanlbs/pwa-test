import React from 'react';
import './NewsDetail.css';
import DOMPurify from 'dompurify';

class NewsDetail extends React.Component {

  state = { article : null}

  componentDidMount(){
    this.getById(window.location.hash.slice(1));
    this.toggleIcons();
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    this.showControls(); // show video controls if any
    this.getLinks()
  }

  getById(id){
    this.props.db.transaction("r", this.props.db.articles, () => {
      this.props.db.articles.get(id).then (item => this.setState({ article: item}))
    }).catch(err => {
      console.error(err.stack);
    });
  }

  // Sanitize to enable proper styling 
  sanitize(htmlStr) {
    return DOMPurify.sanitize(htmlStr, {
      FORBID_TAGS: ['figure','figcaption']
    });
  }

  // Video controls disapear after sanitaton
  showControls()  {
    const videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach( video => {
        video.controls = true;
      });
    }
  }
  
  // Open links in new window
  getLinks() {
    const links = document.querySelectorAll('.article_body a');
    if(links.length > 0){
      links.forEach( link => {
        link.target = '_blank';
      });
    }
  }

  toggleIcons(){
    // Toggle Icons
    let menuIcon = document.querySelector(".menu");
    let backIcon = document.querySelector(".back");
    let simpleMenuIcon = document.querySelector(".simpleMenu");
    menuIcon.style.display = 'none';
    backIcon.style.display = '';
    simpleMenuIcon.style.display = 'none';
  }

  render() {
    if(this.state.article){
      return (
        <div id="detail">
          <div className="divider"></div>
          <section className="typography--section mdc-typography" style={{borderRadius:'5px', padding:'25px',fontSize:'17px',fontFamily:'serif', backgroundColor:'aliceblue'}}>
            <div className='image'>
              <div dangerouslySetInnerHTML={{__html: this.sanitize(this.state.article.fields.main)}} ></div>  
            </div>
            <br />
            <hr />
            <div
              dangerouslySetInnerHTML={{__html: this.sanitize(this.state.article.fields.body)}}
              className="article_body mdc-typography--body1 mdc-typography--adjust-margin" style={{fontSize:'19px',fontFamily:'serif'}}>
            </div>
          </section>
        </div>
      )
    }else{
      return <div>Loading...</div>
    }
  }

}

export default NewsDetail;