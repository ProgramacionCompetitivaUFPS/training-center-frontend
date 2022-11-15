import {bindable, customElement} from 'aurelia-framework'  
  
  @customElement('disqus')
  export class Disqus {
  
    @bindable post 
  
    bind(bindingContext) {
      console.log("this.possssssst",this.post)
      console.log("this.possssssst",bindingContext.post)
      this.post = bindingContext.post
    }
  
    attached() { 
      
      DISQUS.reset({ 
        reload: true,
        config: function() {
          console.log("disqussssssssssssssssss")
          console.log("this.page.url", this.post)
          this.page.identifier = this.post
          //this.page.url = process.env.URL_DISCUSS + this.post.subdirectory
          this.page.title = newPost.title
          this.language = "es"
        }
      }) 
    }
  }