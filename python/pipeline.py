import argparse
import json
from collections import namedtuple
import jmespath

PreferenceMatch = namedtuple(
    "PreferenceMatch", ["product_name", "product_codes"])


def main(product_data, include_tags, exclude_tags):
    """The implementation of the pipeline test."""

    # * query builder that takes an array of tags and builds the appropriate JmesPath Query
    #! BUG - I believe this query is creating some duplicate results. Has been mitigated by using a set rather
    #! than a list for product codes in the group_results function
    def tags_to_query(tags):
        #! assumption - if no includes are specified, it prints all (unless an exclude is passed)
        if len(tags) == 0:
            query = ""
            return query
        # if only one item in list
        elif len(tags) == 1:
            query = f"contains(tags, '{tags[0]}')"
            return query

        # if more than 2 tags in the list
        elif len(tags) > 1:
            query = ""
            for index, tag in enumerate(tags):
                # if not last item in list append ||
                if index < len(tags) - 1:
                    query += f"contains(tags, '{tag}') || "
                # else it is last item and don't append ||
                else:
                    query += f"contains(tags, '{tag}')"
            return query

    # * result sorter that groups product codes with products of the same name
    # * nested loops may not be the most efficent way to this and may not scale well.
    # * this could be an appropriate solution: https://docs.python.org/3/library/collections.html#collections.defaultdict
    # * rambda alternative - https://toolz.readthedocs.io/en/latest/
    # * iteration tools - https://docs.python.org/3/library/itertools.html#itertools.groupby

    # TODO add some destructuring in here to clean it up. Is that a thing?
    def group_results(results):
        grouped_results = []
        # early return if empty arg passed
        if(len(results) == 0):
            return []
        # loop through search results
        for result in results:
            result_name, result_code = result
            # if grouped_results is empty just append it as it is the first result
            if (len(grouped_results) == 0):
                grouped_results.append(
                    PreferenceMatch(result_name, {result_code}))
            # else check if the product exists in grouped_results
            else:
                for index, product in enumerate(grouped_results):
                    # it it exists, add it to the products tuple and break the lookup
                    if grouped_results[index].product_name == result_name:
                        grouped_results[index].product_codes.add(
                            result_code)
                        break
                    # we didn't find the product and that was that the last try
                    if (index + 1 == len(grouped_results)):
                        # so we will add it
                        grouped_results.append(
                            PreferenceMatch(result_name, {result_code}))

        return grouped_results

    # ? Build appropriate query based on passed args
    # if include_tags present only
    if len(include_tags) > 0 and len(exclude_tags) == 0:
        search_query = f"[?({tags_to_query(include_tags)})].[name, code]"
    # if exclude tags present only
    elif len(include_tags) == 0 and len(exclude_tags) > 0:
        search_query = f"[!({tags_to_query(exclude_tags)})].[name, code]"
    # if both types of tags present
    elif len(include_tags) > 0 and len(exclude_tags) > 0:
        search_query = f"[?({tags_to_query(include_tags)}) && !({tags_to_query(exclude_tags)})].[name, code]"
    # if no tags are passed get all results
    else:
        search_query = f"[].[name, code]"

    # ? Query json for results
    query_results = jmespath.search(search_query, product_data)
    # ? Sort query results
    out = group_results(query_results)
    return out


if __name__ == "__main__":

    def parse_tags(tags):
        return [tag for tag in tags.split(",") if tag]

    parser = argparse.ArgumentParser(
        description="Extracts unique product names matching given tags."
    )
    parser.add_argument(
        "product_data",
        help="a JSON file containing tagged product data",
    )
    parser.add_argument(
        "--include",
        type=parse_tags,
        help="a comma-separated list of tags whose products should be included",
        default="",
    )
    parser.add_argument(
        "--exclude",
        type=parse_tags,
        help="a comma-separated list of tags whose matching products should be excluded",
        default="",
    )

    args = parser.parse_args()

    with open(args.product_data) as f:
        product_data = json.load(f)

    order_items = main(product_data, args.include, args.exclude)

    for item in order_items:
        print("%s:\n%s\n" % (item.product_name, "\n".join(item.product_codes)))
