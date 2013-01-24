import os
from setuptools import setup, find_packages

from resumablebottle import VERSION


f = open(os.path.join(os.path.dirname(__file__), 'README.rst'))
readme = f.read()
f.close()

setup(
    name='resumablebottle',
    version=".".join(map(str, VERSION)),
    description='Bottle based ',
    long_description=readme,
    author='Ashley Camba Garrido',
    author_email='ashwoods@gmail.com',
    url='https://github.com/ashwoods/bottle-resumable',
    packages=find_packages(),
    install_requires = [
        'bottle',
        'pairtree',
        'ofs',
        'gevent'
    ],
    tests_require = ['flake8','mock', 'coverage', 'nose', 'webtest'],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Framework :: Bottle',
],
)
