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


* [Sagiri](#Sagiri)
    * [new Sagiri(key, numRes)](#new_Sagiri_new)
    * [.getSauce(file)](#Sagiri+getSauce) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getSource(file)](#Sagiri+getSource) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_Sagiri_new"></a>

### new Sagiri(key, numRes)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>String</code> |  | API Key for SauceNAO |
| numRes | <code>Number</code> | <code>5</code> | amount of responses you want returned from the API. Default is 5 Responses. |

<br>
<a name="Sagiri+getSauce"></a>

### Sagiri#getSauce(file) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
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

<br>
<a name="Sagiri+getSource"></a>

### Sagiri#getSource(file) ⇒ <code>Promise.&lt;Object&gt;</code>
An alias of [<code>Sagiri#getSauce</code>](#Sagiri+getSauce)

**Kind**: instance method of [<code>Sagiri</code>](#Sagiri)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of all the results from the API, with parsed data.  
**See**: Sagiri#getSauce  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Either a file or URL that you want to find the source of. |

