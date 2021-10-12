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
    postChanged(newPost, oldPost) { // oldPost is null in this case
      DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = newPost.identifier;
          // For some reason, urls with # don't work with Disqus.
          // Working url: http://example.com/blog/example-post
          // Non working url: http://example.com/#/blog/example-post
          this.page.url = process.env.URL_DISCUSS + newPost.subdirectory;
          this.page.title = newPost.title;
        }
      });
    }
  }