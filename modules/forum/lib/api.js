import { create } from 'apisauce'
import Router from 'next/router'


export default class ForumApi extends Object {
    constructor()
    {
        super();
        this.api = create({
            baseURL: 'http://localhost:3000'
        });
    }
    getForumList()
    {
        var forumlist = ['General Discussion','Support','Tutorials'];
        return forumlist;
    }
    getTopicList(forumid)
    {
        if (forumid == 0)
        {
            return ["GD - Topic1", "GD - Topic2"];
        }
        else if (forumid == 1)
        {
            return ["Support - Topic 1", "Support - Topic 2"];
        }
        else if (forumid == 2)
        {
            return ["Tut - Topic 1","Tut - Topic 2", "Tut - Topic 3"];
        }
    }
    
}