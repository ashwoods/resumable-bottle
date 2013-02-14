from gevent import monkey; monkey.patch_all()

from bottle import Bottle, run, template, response, get, post, request, route, debug, static_file
from file import ResumableFile
from json import dumps

app = Bottle()

@app.get('/upload')
def check_chunk():
    """Handles the resumable.js GET request. In the form of:

    http://example.com/upload?
        resumableChunkNumber={{CHUNK_NUMBER}}&
        resumableChunkSize={{CHUNK_SIZE}}&
        resumableTotalSize={{TOTAL_SIZE}}&
        resumableIdentifier={{IDENTIFIER}}&
        resumableFilename={{FILE_NAME}}&
        resumableRelativePath={{RELATIVE_PATH}}

    """
    resumable_file = ResumableFile(**dict(request.GET)) #TODO: make the type of resumablefile configurable
    if not (resumable_file.chunk_exists or resumable_file.is_complete):
        response.status = 404
    return

@app.post('/upload')
def process_chunk():

    chunk = request.files.get('file')
    resumable_file = ResumableFile(**dict(request.POST))
    if resumable_file.chunk_exists:
        return
    else:
        resumable_file.process_chunk(chunk)
    if resumable_file.is_complete:
        process_file(resumable_file)



def process_file(resumable_file):
    print resumable_file.url

@app.post('/check')
def index():
    response.content_type = 'application/json'
    #return request.body
    ret = { "id": 1, "pass": '1' }
    return dumps(ret)

@app.get('/populate')
def index():
    response.content_type = 'application/json'
    ret = [ { "created": "2013-01-10T01:56:34.338489", 
                "filetype": "image/jpeg", 
                "id": "1", 
                "md5": "9f68d2168c1ebb5b6368b7ed5b25aeb3", 
                "modified": "2013-01-10T01:56:34.341322", 
                "original_file": "null", 
                "original_filename": "kitten.jpeg", 
                "original_filesize": "124142", 
                "project": "/projects/apiv1/projects/5093/", 
                "resource_uri": "/projects/apiv1/asset/1/", 
                "short_description": "", 
                "url": "" 
            },
            { "created": "2012-03-10T01:36:34.338483", 
                "filetype": "image/png", 
                "id": "1", 
                "md5": "9f68d2168c1ebb5b6368b7ed5b25aeb3", 
                "modified": "2012-02-10T01:56:34.341322", 
                "original_file": "null", 
                "original_filename": "something.jpeg", 
                "original_filesize": "125346", 
                "project": "/projects/apiv1/projects/5094/", 
                "resource_uri": "/projects/apiv1/asset/1/", 
                "short_description": "", 
                "url": "" 
            }
        ]
    return dumps(ret)

@app.get('/populate2')
def index():
    response.content_type = 'application/json'
    ret = [ { "created": "2012-03-10T01:36:34.338483", 
                "filetype": "image/png", 
                "id": "1", 
                "md5": "9f68d2168c1ebb5b6368b7ed5b25aeb3", 
                "modified": "2012-02-10T01:56:34.341322", 
                "original_file": "null", 
                "original_filename": "something.jpeg", 
                "original_filesize": "125346", 
                "project": "/projects/apiv1/projects/5094/", 
                "resource_uri": "/projects/apiv1/asset/1/", 
                "short_description": "", 
                "url": "" 
            } ]
    return dumps(ret)

@app.route('/js/:path#.+#', name='js')
def static(path):
    return static_file(path, root='js')

@app.route('/css/:path#.+#', name='css')
def static(path):
    return static_file(path, root='css')

@app.route('/img/:path#.+#', name='img')
def static(path):
    return static_file(path, root='img')

@app.route('/test')
def test_resumable():
    return template('example')

if __name__ == '__main__':
    run(app, debug=True, reloader=True, host='0.0.0.0', port=8001, server='gevent')
