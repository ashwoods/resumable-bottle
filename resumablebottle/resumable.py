from gevent import monkey; monkey.patch_all()

from bottle import Bottle, run, template, response, get, post, request, route, debug
from file import ResumableFile


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




@app.route('/test')
def test_resumable():
    return template('example')


if __name__ == '__main__':
    run(app, host='localhost', port=8000, server='gevent')