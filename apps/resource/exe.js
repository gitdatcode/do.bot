const exec = require('child_process').execSync,
    fetch = require('node-fetch');

const url = 'http://localhost:9292',
    resource = '/home/website/env/bin/python /home/website/datcode.public/app.py';

const exe = {
    'search': async function(search, page=0){
        try{
            search = encodeURIComponent(search)
            const search_uri = `${url}/api/resource/search?search=${search}&page=${page}`,
                res = await fetch(search_uri),
                json = await res.json();
            return json
        }catch(e){
            console.log(e)
        }
    },

    'add': async function(title, description, uri, tags, date_created, username, slack_id){
        try{
            let body = JSON.stringify({
                            title: title,
                            description: description,
                            uri: uri,
                            tags: tags,
                            date_created: date_created,
                            username: username,
                            slack_id: slack_id
                        })
            const add_uri = `${url}/api/slack/resource`,
                res =  await fetch(add_uri, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: body
                    })
                json = await res.json();
            return json
        }catch(e){
            console.log(e)
        }
    }
};

module.exports = exe;
