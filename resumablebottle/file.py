try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO


from ofs.local import PTOFS

#TODO: make this configurable
chunk_storage = PTOFS(storage_dir = "/tmp/chunks")
file_storage = PTOFS(storage_dir = "/tmp/files", uri_base="urn:uuid:", hashing_type="md5")


class ResumableFile(object):


    def __init__(self, **kwargs):


        self.chunk_storage = chunk_storage
        self.file_storage  = file_storage

        self.kwargs = kwargs
        self.chunk_suffix = "_part_"

        self.resumableChunkNumber= self.kwargs.get('resumableChunkNumber', None)
        self.resumableChunkSize= self.kwargs.get('resumableChunkSize', None)
        self.resumableTotalSize= self.kwargs.get('resumableTotalSize', None)
        self.resumableIdentifier= self.kwargs.get('resumableIdentifier', None)
        self.resumableFilename= self.kwargs.get('resumableFilename', None)
        self.resumableRelativePath= self.kwargs.get('resumableRelativePath', None)

        if not self.chunk_storage.exists(self.resumableIdentifier):
            self.chunk_storage.claim_bucket(self.resumableIdentifier)

    @property
    def chunk_exists(self):
        """Checks if the requested chunk exists
        """

        return self.chunk_storage.exists(self.resumableIdentifier,  self.resumableFilename, )

    @property
    def chunk_name(self):
        """Returns formatted chunk name"""

        return "%s%s%s" % (self.filename, self.chunk_suffix, self.resumableChunkNumber.zfill(4))


    @property
    def chunks(self):
        """Returns list of all available chunks
        """

        labels = self.chunk_storage.list_labels(self.resumableIdentifier)
        labels.sort()
        return labels

    def delete_chunks(self):
        [self.chunk_storage.delete(chunk) for chunk in self.chunks]


    def process_file(self):
        content = StringIO()
        for chunk in self.chunks:
            content.write(self.chunk_storage.get_stream(self.resumableIdentifier, chunk).read())

        file_storage.put_stream(self.resumableIdentifier, self.filename, content)


    @property
    def file(self):
        """Gets the complete file.
        """
        if not self.is_complete:
            raise Exception('Chunk(s) still missing')

        # check if it already exists in storage

        if not self.file_storage.exists(self.resumableIdentifier, self.filename):
            self.process_file()

        return self.file_storage.get_stream(self.resumableIdentifier, self.filename)


    @property
    def url(self):
        """Returns the location of completed file"""

        if not self.is_complete:
            raise Exception('Chunk(s) still missing')

        if not self.file_storage.exists(self.resumableIdentifier, self.filename):
            self.process_file()

        return self.file_storage.get_url(self.resumableIdentifier, self.filename)

    @property
    def filename(self):
        """Gets the filename."""
        filename = self.kwargs.get('resumableFilename', None)
        if filename is None:
            raise Exception('Invalid filename')
        if '/' in filename:
            raise Exception('Invalid filename')
        return "%s_%s" % (
            self.kwargs.get('resumableTotalSize'), filename) # Do we really need this?

    @property
    def is_complete(self):
        """Checks if all chunks are allready stored.
        """
        if self.chunk_storage.exists(self.resumableIdentifier, self.filename):
            return True

        return int(self.resumableTotalSize) == self.size

    def process_chunk(self, file):
        if not self.chunk_exists:
            self.chunk_storage.put_stream(
                self.resumableIdentifier,
                '%s%s%s' % (self.filename, self.chunk_suffix, self.resumableChunkNumber.zfill(4)),
                file.file
            )


    @property
    def size(self):
        """Gets chunks size.
        """
        size = 0
        for chunk in self.chunks:
            size += self.chunk_storage.get_metadata(self.resumableIdentifier, chunk)['_content_length']
        return size
