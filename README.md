# Evil EPUBs

In our paper [_Reading Between the Lines: An Extensive Evaluation of the Security and Privacy Implications of EPUB Reading Systems (IEEE Symposium on Security & Privacy 2021)_](https://www.computer.org/csdl/pds/api/csdl/proceedings/download-article/1mbmHAQitna/pdf), we reported on a semi-automated evaluation of the security and privacy implications of 97 EPUB reading systems.
Our results uncovered that almost all of the JavaScript-supporting reading systems do not satisfy the security recommendations of the official EPUB 3.2 specification.
Furthermore, various reading systems allowed a loaded EPUB to leak local file system information.

For the purpose of transparancy, we have released the testbed EPUBs used in our evaluation through this repository, as well as the source-code to construct them.
This way, we want to reach out to three parties in particular:

* _Developers_:
By releasing the EPUBs used in our evaluation testbed, we hope to spread awareness on the identified issues among EPUB reading system developers.
Furthermore, we hope that this testbed can serve as a convenient tool for validating the security and privacy properties of future reading system releases.

* _End-users_:
It is often difficult to discern between secure and insecure reading systems; e.g. there is no clear indication whether the EPUB 3.2 security recommendations are satisfied.
We encourage end-users to employ the evaluation EPUBs provided by this repository to resolve any unclarities concerning the security and privacy properties of their EPUB reading system.

* _Researchers_:
We argue that this research demonstrates that the consolidation of web technologies in non-browser applications can be prone to a flawed translation of security and privacy properties.
With this work, we hope to have encouraged fellow researchers to further explore this research area.


## Instructions

Next to building the evaluation EPUBs from source, it's also possible to download pre-built evaluation EPUBs as a [release](https://github.com/DistriNet/evil-epubs/releases/latest/).


### Building EPUBs

Using the `create.sh` bash script, you can build an EPUB from source. Make sure that `create.sh` has sufficient permissions to be executed!

Arguments:
1. Path to source folder (required)
2. Path to destination folder (optional, default: `./`)

The name of the built EPUB file will be that of the source folder.

For example, the EPUB built through the following command will be saved as `/tmp/javascript_execution.epub`.

```bash
./create.sh src/javascript_execution /tmp/
```

#### EPUBCheck

W3C provides an open-source EPUB conformance validator, called [EPUBCheck](https://github.com/w3c/epubcheck).
The `create.sh` script will automatically run this validator if you download and unzip a [release](https://github.com/w3c/epubcheck/releases) within the repository root folder.
Please note that EPUBCheck requires Java to be installed.


### Evaluating EPUB reading systems

Most of the available EPUBs are _plug-and-play_; the evaluation is performed by simply loading the EPUB into the to-be-evaluated EPUB reading system.
Upon rendering, the included tests will be executed, after which the results will be displayed on the EPUB's pages.
Please note that some tests might fail for certain EPUB reading systems, due to unsupported functionality.

Some tests require some manual preparation, e.g. for assessing local file system access, you'll have to create specific files on the operating system.
These instructions are always included in the associated EPUBs.

All tests require JavaScript execution, so it's recommended to first perform the `src/javascript_execution` evaluation to make sure the EPUB reading system actually supports JavaScript.

**Evaluations without manual preparation:**
* `src/javascript_execution`
* `src/remote_communication` (the more advanced part requires a local web server, however)
* `src/engine_identifier`
* `src/feature_access`
* `src/uri_handles`

**Evaluations that require manual preparation:**
* `src/file_system_access`

New experiments can be developed by changing existing experiments, or by using the `src/template` to implement from scratch.


## Collaborating

We aim to keep this repository up-to-date, adding and adjusting for any new discoveries concerning the security and privacy considerations of EPUB reading systems.
In light of this, we welcome issue reporting, pull requests and any other helpful interactions.

Please reach out to us if you have any questions:
* [Gertjan Franken](https://distrinet.cs.kuleuven.be/people/gertjan)
* [Tom Van Goethem](https://distrinet.cs.kuleuven.be/people/tomv)
* [Wouter Joosen](https://distrinet.cs.kuleuven.be/people/wouter)
