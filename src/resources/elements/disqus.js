import {bindable, customElement} from 'aurelia-framework'  
  
  @customElement('disqus')
  export class Disqus {
  
    @bindable post 
  
    bind(bindingContext) {
      this.post = bindingContext.post
    }
  
    attached() { 
      
      DISQUS.reset({ 
        reload: true,
        config: function() {
          this.page.identifier = this.post
          //this.page.url = process.env.URL_DISCUSS + this.post.subdirectory
          this.page.title = newPost.title
          this.language = "es"
        }
      }) 
    }
  }