# D2JS

"D2JS" is a framework that allows you to create "HTML5 Canvas + JavaScript" apps with DoJa-style app flow, event processing, and graphic processing.

## core/d2js.js, core/d2js.debug.js

Contains all source content except the core/extras folder.

## How to build

Please set the environment variable "AJAXMINPATH" in advance.

When build.bat is executed, d2js.js and d2js.debug.js will be generated under the core folder.

The following tools are required separately for building.

### MinGW

Used as a UTF-8 compatible C preprocessor.

### Microsoft Ajax Minifier

A tool for compressing and obfuscating JavaScript code.

## core/extras folder

A group of utility files that can be embedded in HTML with script tags.

## docs folder

D2JS document. Open "index.html" in your browser.

## samples folder

Various sample apps are stored. See the D2JS documentation for more details.

It is necessary to set the environment variable "SKCOMMONPATH" to build some sample apps.

## tools folder

### Tool "image2html"

See the "Using Image Resources" section of the D2JS documentation.

### Tool "image2js"

See the "Using Image Resources" section of the D2JS documentation.

### Tool "string2html"

See the section "Using String Resources" in the D2JS documentation.
