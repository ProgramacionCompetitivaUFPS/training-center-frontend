import {bindable, customElement} from 'aurelia-framework';
  
  @customElement('disqus')
  export class Disqus {
  
    @bindable post;
  
    bind(bindingContext) {
      this.post = bindingContext.post;
    }
  
    attached() { 
      
      DISQUS.reset({ 
        reload: true,
        config: function() {
          this.page.identifier = this.post.identifier;
          //this.page.url = process.env.URL_DISCUSS + this.post.subdirectory;
          this.page.title = newPost.title;
          console.log("this.page.url", this.page.url)
        }
      });
    }
  }