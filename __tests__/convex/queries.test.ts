import { ConvexTestingHelper } from "convex/testing";
import { describe, it, expect, beforeEach } from '@jest/globals';
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

describe('Convex Queries', () => {
  let t: ConvexTestingHelper;

  beforeEach(async () => {
    t = new ConvexTestingHelper(schema);
  });

  it('should return welcome message from hello query', async () => {
    const result = await t.query(api.queries.hello, {});
    expect(result).toBe("味ばあへようこそ！");
  });

  it('should return empty array from getRecipes initially', async () => {
    const result = await t.query(api.queries.getRecipes, {});
    expect(result).toEqual([]);
  });
});