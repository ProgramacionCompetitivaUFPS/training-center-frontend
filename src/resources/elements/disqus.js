import {bindable, customElement} from 'aurelia-framework';
  
  @customElement('disqus')
  export class Disqus {
  
    @bindable post;
  
    bind(bindingContext) {
      // Making sure the parent view-model exposes an object that contains the information
      // needed by Disqus.
      // This will trigger the function below.
      this.post = bindingContext.post;
    }
  
    // Conventional method that gets called when the bindable property post changes.
    attached() { // oldPost is null in this case
      console.log("algo ta pasando aki")
   
      DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = this.post.identifier;
          // For some reason, urls with # don't work with Disqus.
          // Working url: http://example.com/blog/example-post
          // Non working url: http://example.com/#/blog/example-post
          this.page.url = process.env.URL_DISCUSS + this.post.subdirectory;
          this.page.title = newPost.title;
        }
      });
    }
  }