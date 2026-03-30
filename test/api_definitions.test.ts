import test from "ava";
import { Pagination } from "../lib/api_definitions.js";

// Constructor and property checks

test("Pagination: creates a valid instance with valid parameters", (t) => {
  const pagination = new Pagination(1, 10, 100);
  t.is(pagination.page, 1);
  t.is(pagination.limit, 10);
  t.is(pagination.count, 100);
});

test("Pagination: throws RangeError if page is less than 1", (t) => {
  const error = t.throws(() => new Pagination(0, 10), { instanceOf: RangeError });
  t.is(error?.message, "Pagination: page must be an integer >= 1, got 0");
});

test("Pagination: throws RangeError if limit is less than 0", (t) => {
  const error = t.throws(() => new Pagination(1, -1), { instanceOf: RangeError });
  t.is(error?.message, "Pagination: limit must be an integer between 0 and 1000, got -1");
});

test("Pagination: throws RangeError if limit is greater than 100", (t) => {
  const error = t.throws(() => new Pagination(1, 1001), { instanceOf: RangeError });
  t.is(error?.message, "Pagination: limit must be an integer between 0 and 1000, got 1001");
});

test("Pagination: throws RangeError if count is negative", (t) => {
  const error = t.throws(() => new Pagination(1, 10, -1), { instanceOf: RangeError });
  t.is(error?.message, "Pagination: total must be a non-negative integer, got -1");
});

// Static helpers

test("Pagination.empty returns page=1, limit=0, count=0", (t) => {
  const empty = Pagination.empty();
  t.is(empty.page, 1);
  t.is(empty.limit, 0);
  t.is(empty.count, 0);
});

test("Pagination.fromPaging creates instance from paging and optional count", (t) => {
  const paging = { page: 2, limit: 20 } as any;
  const pagination = Pagination.fromPaging(paging, 200);
  t.is(pagination.page, 2);
  t.is(pagination.limit, 20);
  t.is(pagination.count, 200);
});

test("Pagination.fromPaging handles undefined count", (t) => {
  const paging = { page: 3, limit: 15 } as any;
  const pagination = Pagination.fromPaging(paging);
  t.is(pagination.page, 3);
  t.is(pagination.limit, 15);
  t.is(pagination.count, undefined);
});

// JSON serialization

test("Pagination: serializes correctly to JSON", (t) => {
  const pagination = new Pagination(1, 10, 100);
  const json = JSON.parse(JSON.stringify(pagination));
  t.deepEqual(json, {
    page: 1,
    limit: 10,
    count: 100
  });
});

test("Pagination: serializes correctly to JSON with undefined count", (t) => {
  const pagination = new Pagination(2, 20);
  const json = JSON.parse(JSON.stringify(pagination));
  t.deepEqual(json, {
    page: 2,
    limit: 20
  });
});
