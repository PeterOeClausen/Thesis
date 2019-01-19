export default class ThreeBrowserController{
    //Singleton pattern:
    static instance = null;

    //Used so that I do not have to pass the controller arround to every component that might call it...
    static getInstance(){
        if(ThreeBrowserController.instance == null){
            ThreeBrowserController.instance = new ThreeBrowserController();
        }

        return ThreeBrowserController.instance;
    }

    threeBrowserInstance = null;

    setThreeBrowserInstance(tbInstance){
        this.threeBrowserInstance = tbInstance;
    }

    getThreeBrowserInstance(){
        if(this.threeBrowserInstance == null){
            console.warn("ThreeBrowser instance was null in ThreeBrowserController!");
        }
        else return this.threeBrowserInstance;
    }

    fetchTagsInTagset(dimData){
        fetch("https://localhost:44317/api/" + dimData.type + "/" + dimData.id)
        .then(result => {return result.json();})
        .then(data => {
            data.forEach((r) => console.log(r))
            
        });
    }

    sayHello(){
        console.log("Hello from singleton!");
    }
}