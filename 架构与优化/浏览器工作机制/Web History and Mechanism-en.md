# Web History and Mechanism

- The user enters a URL in the browser address bar
- The browser takes the domain name from the URL and requests the IP address of the server from a [DNS](https://en.wikipedia.org/wiki/Domain_Name_System).
- The browser creates an HTTP packet saying that it requests a web page located on the remote server.
- The packet is sent to the TCP layer which adds its own information on top of the HTTP packet. This information is required to maintain the started session.
- The packet is then handed to the IP layer which main job is to figure out a way to send the packet from you to the remote server. This information is also stored on top of the packet.
- The packet is sent to the remote server.
- Once the packet is received, the response gets sent back in a similar manner.

# Browser Internals

![](https://cdn-images-1.medium.com/max/800/1*lMBu87MtEsVFqqbfMum-kA.png)

- **User interface**: this includes the address bar, the back and forward buttons, bookmarking menu, etc. In essence, this is every part of the browser display except for the window where you see the web page itself.
- **Browser engine**:\*\* **it** \*\*handles the interactions between the user interface and the rendering engine
- **Rendering engine**: it’s responsible for displaying the web page. The rendering engine parses the HTML and the CSS and displays the parsed content on the screen.
- **Networking**: these are network calls such as XHR requests, made by using different implementations for the different platforms, which are behind a platform-independent interface. We talked about the networking layer in more detail in a [previous post](https://blog.sessionstack.com/how-modern-web-browsers-accelerate-performance-the-networking-layer-f6efaf7bfcf4) of this series.
- **UI backend**: it’s used for drawing the core widgets such as checkboxes and windows. This backend exposes a generic interface that is not platform-specific. It uses operating system UI methods underneath.
- **JavaScript engine**: We’ve covered this in great detail in a [previous post](https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e)from the series. Basically, this is where the JavaScript gets executed.
- **Data persistence**: your app might need to store all data locally. The supported types of storage mechanisms include [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [indexDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [WebSQL](https://en.wikipedia.org/wiki/Web_SQL_Database) and [FileSystem](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem).
