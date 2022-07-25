# SignIQ code test - "pipeline"

This is a data-processing test. You run a minimalist online clothing store which sells exactly one style of each item of clothing - one t-shirt, one pair of socks, one jacket, etc. Each of these comes in a range of colours and sizes. Each specific product sold is uniquely identified by an item code.

The task is to take a set of product data and some tags indicating preferences, and work out which products match those preferences. The utility takes the path to a JSON file containing product data, and comma-separated lists of "include" and "exclude" tags. The products matched shall be those which have ANY of the include tags, and NONE of the exclude tags.

The plumbing of the pipeline.py file is written, including input, output and argument parsing. Your job is to implement the `main` function, which accepts arguments `product_data`, a Python data structure corresponding to the parsed JSON input file, and `include_tags` and `exclude_tags`, both lists of strings. The function should return a list of `PreferenceMatch` namedtuples, also defined for you. Each `PreferenceMatch` has attributes `product_name` (e.g. "T-Shirt"), and `product_codes`, a list of the product codes of every matching product that shares that product name.

A make target is provided to run the program - you can invoke it with `make run`.

## EXAMPLE INPUT
(Comes as command line arguments)

`product_data.json --include red,green --exclude large`

Where product_data.json defines a structure like:
```json
[
  {
    "name": "T-Shirt",
		"tags": ["red", "large"],
		"code": "A21313"
  },
  // etc...
]
```

## EXAMPLE OUTPUT

Print to stdout:

```
T-Shirt:
A21312

Pants:
A21455
```
