const http = require('http');
const fs = require('fs');

const port = 8080;

const buildCategoryTree = () => {
    let rawdata = fs.readFileSync('categories.json');
    let categories = JSON.parse(rawdata);

    let hashMap = {
        "root": {
            "categoryId": "root",
            "name": "Root Category",
            "parent": null,
            "children": []
        }
    }

    for (let category of categories) {
        let parent = category['parent'];
        let categoryId = category['categoryId'];

        if (!hashMap[categoryId]) {
            hashMap[categoryId] = {
                "categoryId": categoryId,
                "name": category['name'],
                "parent": parent,
                "children": []
            };
        } else {
            hashMap[categoryId]['categoryId'] = categoryId;
            hashMap[categoryId]['name'] = category['name'];
            hashMap[categoryId]['parent'] = category['parent'];
        }

        if (!hashMap[parent]) {
            hashMap[parent] = {
                "children": [hashMap[categoryId]]
            }
        } else {
            hashMap[parent]['children'].push(hashMap[categoryId])
        }
    }

    return hashMap['root'];
}

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(buildCategoryTree()));
    res.end();
}).listen(port, "");