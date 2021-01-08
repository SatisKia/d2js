# D2JS

[English version is here](./README_E.md)

「D2JS」は、DoJa風のアプリの流れ、イベント処理、グラフィック処理で「HTML5 Canvas + JavaScript」アプリを作成できるフレームワークです。

----------

## core/d2js.js, core/d2js.debug.js

core/extrasフォルダを除く全てのソース内容が含まれています。

## ビルド方法

事前に環境変数"AJAXMINPATH"の設定を行ってください。

build.batを実行しますと、coreフォルダ下にd2js.jsとd2js.debug.jsが生成されます。

ビルドには別途、次のツールが必要です。

### MinGW

UTF-8対応Cプリプロセッサとして使用します。

### Microsoft Ajax Minifier

JavaScriptコードの圧縮・難読化ツールです。

----------

## core/extrasフォルダ

HTMLにscriptタグで埋め込むことができるユーティリティ・ファイル群です。

## docsフォルダ

D2JSドキュメントです。「index.html」をブラウザで開いてください。

## samplesフォルダ

各種サンプルアプリが格納されています。詳細は、D2JSドキュメントを参照ください。

一部のサンプルアプリのビルドには環境変数"SKCOMMONPATH"の設定が必要です。

## toolsフォルダ

### ツール「image2html」

D2JSドキュメントの『イメージリソースの利用』の項を参照ください。

### ツール「image2js」

D2JSドキュメントの『イメージリソースの利用』の項を参照ください。

### ツール「string2html」

D2JSドキュメントの『文字列リソースの利用』の項を参照ください。
