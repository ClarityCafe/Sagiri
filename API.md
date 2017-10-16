# API Documentation

<a name="Sagiri"></a>

## Sagiri
Query handler for SauceNAO.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | API key |
| numRes | <code>Number</code> | Amount of responses returned from the API. |
| shortLimit | <code>Number</code> | Ratelimit for the "short" period, currently the last 30 seconds. Will be null before the first request. |
| longLimit | <code>Number</code> | Ratelimit for the "long" period, currently 24 hours. Will be null before the first request. |
| shortRemaining | <code>Number</code> | Amount of requests left during the "short" period before you get ratelimited. Will be null before the first request. |
| longRemaining | <code>Number</code> | Amount of requests left during the "long" period before you get ratelimited. Will be null before the first request. |


* [Sagiri](#Sagiri)
    * [new Sagiri(key, [options])](#new_Sagiri_new)
    * [.getSauce(file)](#Sagiri+getSauce) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getSource(file)](#Sagiri+getSource) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>

<a name="new_Sagiri_new"></a>

### new Sagiri(key, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>String</code> |  | API Key for SauceNAO |
| [options] | <code>Object</code> |  | Optional options |
| [options.numRes] | <code>Number</code> | <code>5</code> | Number of results to get from SauceNAO. |
| [options.getRating] | <code>Boolean</code> | <code>false</code> | Whether to retrieve the rating of a source or not. |

<a name="Sagiri+getSauce"></a>

### sagiri.getSauce(file) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Searches for potential sources of an image.

**Kind**: instance method of [<code>Sagiri</code>](#Sagiri)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of all the results from the API, with parsed data.  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Either a file or URL that you want to find the source of. |

**Example**  
```js
client.getSauce('http://cfile29.uf.tistory.com/image/277D9B3453F9D9283659F4').then(console.log);
```
<a name="Sagiri+getSource"></a>

### sagiri.getSource(file) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
An alias of Sagiri#getSauce

**Kind**: instance method of [<code>Sagiri</code>](#Sagiri)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of all the results from the API, with parsed data.  
**See**: Sagiri#getSauce  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Either a file or URL that you want to find the source of. |

