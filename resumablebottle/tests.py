from webtest import TestApp
import resumable



def test_resumable_check():
    app = TestApp(resumable.app)
    assert app.get('/upload', params={'resumableFilename':'test.ogg'}).status == '200 OK'        # fetch a page successfully


