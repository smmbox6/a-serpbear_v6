/** @jest-environment node */

import MockBetterSqlite3 from '../../__mocks__/better-sqlite3';

describe('MockBetterSqlite3 ReDoS Prevention', () => {
  let mockDb: MockBetterSqlite3;

  beforeEach(() => {
    mockDb = new MockBetterSqlite3(':memory:');
  });

  afterEach(() => {
    if (!mockDb.closed) {
      mockDb.close();
    }
  });

  describe('ReDoS Prevention Tests', () => {
    it('should handle CREATE TABLE statement with excessive whitespace without timing out', () => {
      const start = Date.now();
      // Create a potentially problematic SQL string with excessive whitespace
      const maliciousWhitespace = ' \t\r\n'.repeat(100);
      const sql = `CREATE${maliciousWhitespace}TABLE${maliciousWhitespace}test_table (id INTEGER)`;
      
      const result = mockDb.execute(sql);
      const elapsed = Date.now() - start;
      
      // Should complete within reasonable time (< 100ms)
      expect(elapsed).toBeLessThan(100);
      expect(result).toEqual({ changes: 0 });
    });

    it('should handle ReDoS attack pattern with nested quantifiers', () => {
      const start = Date.now();
      // This pattern could cause catastrophic backtracking with the vulnerable regex
      // Pattern: spaces followed by alternating space/tab that doesn't end with expected keyword
      const attackPattern = ' '.repeat(20) + ' \t'.repeat(20) + ' '.repeat(20) + 'X';
      const sql = `CREATE${attackPattern}TABLE test_table (id INTEGER)`;
      
      const result = mockDb.execute(sql);
      const elapsed = Date.now() - start;
      
      // Should complete within reasonable time even if pattern doesn't match
      expect(elapsed).toBeLessThan(100);
      // This should not match because 'X' is not 'TABLE'
      expect(result).toEqual({ changes: 0 });
    });

    it('should prevent ReDoS attack with extremely pathological input', () => {
      const start = Date.now();
      // This is a classic ReDoS attack pattern: alternating characters that cause maximum backtracking
      // With unbounded + quantifiers, this would cause exponential backtracking
      // The pattern below creates a string like:
      // "CREATE \t \t \t ... \t         X"
      // - 'CREATE' followed by 1000 repetitions of "space-tab"
      // - then 10 spaces, then 'X'
      // This pattern is designed to trigger catastrophic backtracking in vulnerable regexes that use nested quantifiers to match whitespace before a keyword.
      const pathologicalInput = `CREATE${' \t'.repeat(1000)}${' '.repeat(10)}X`;
      
      const result = mockDb.execute(pathologicalInput);
      const elapsed = Date.now() - start;
      
      // Should complete quickly even with pathological input - the bounded quantifier prevents ReDoS
      expect(elapsed).toBeLessThan(50);
      expect(result).toEqual({ changes: 0 });
    });

    it('should handle INSERT INTO statement with excessive whitespace without timing out', () => {
      const start = Date.now();
      // Create a potentially problematic SQL string with excessive whitespace
      const maliciousWhitespace = ' \t\r\n'.repeat(100);
      const sql = `INSERT${maliciousWhitespace}INTO${maliciousWhitespace}test_table (name) VALUES ('test')`;
      
      const result = mockDb.execute(sql);
      const elapsed = Date.now() - start;
      
      // Should complete within reasonable time (< 100ms)
      expect(elapsed).toBeLessThan(100);
      expect(result).toEqual({ changes: 1, lastInsertRowid: 1 });
    });

    it('should handle SELECT statement with excessive whitespace without timing out', () => {
      const start = Date.now();
      // Create a potentially problematic SQL string with excessive whitespace
      const maliciousWhitespace = ' \t\r\n'.repeat(100);
      const sql = `SELECT${maliciousWhitespace}*${maliciousWhitespace}FROM${maliciousWhitespace}test_table`;
      
      const result = mockDb.select(sql);
      const elapsed = Date.now() - start;
      
      // Should complete within reasonable time (< 100ms)
      expect(elapsed).toBeLessThan(100);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should still match valid SQL statements correctly', () => {
      // Test normal CREATE TABLE
      expect(mockDb.execute('CREATE TABLE users (id INTEGER)')).toEqual({ changes: 0 });
      
      // Test CREATE TABLE with reasonable whitespace
      expect(mockDb.execute('CREATE \t TABLE \n users2 (id INTEGER)')).toEqual({ changes: 0 });
      
      // Test INSERT INTO
      const insertResult = mockDb.execute('INSERT INTO users (name) VALUES (?)', ['test']);
      expect(insertResult.changes).toBe(1);
      expect(insertResult.lastInsertRowid).toBe(1);
      
      // Test SELECT
      const selectResult = mockDb.select('SELECT * FROM users');
      expect(Array.isArray(selectResult)).toBe(true);
    });

    it('should not match invalid SQL patterns', () => {
      // These should not trigger the CREATE pattern
      expect(mockDb.execute('CREATETABLE users (id INTEGER)')).toEqual({ changes: 0 });
      expect(mockDb.execute('UPDATE users SET name = "test"')).toEqual({ changes: 0 });
      
      // This should not trigger the INSERT pattern  
      expect(mockDb.execute('INSERTINTO users (name) VALUES ("test")')).toEqual({ changes: 0 });
      
      // These should return empty array (no match)
      expect(mockDb.select('SELECTALL * FROM users')).toEqual([]);
      expect(mockDb.select('SELECT')).toEqual([]);
    });
  });

  describe('Edge Case Validation', () => {
    it('should handle mixed whitespace characters correctly', () => {
      const mixedWhitespace = ' \t\r\n \t\r\n';
      const sql = `CREATE${mixedWhitespace}TABLE${mixedWhitespace}mixed_table (id INTEGER)`;
      
      const result = mockDb.execute(sql);
      expect(result).toEqual({ changes: 0 });
    });

    it('should limit excessive repeated whitespace patterns', () => {
      // Test with alternating patterns that could cause backtracking
      const alternatingPattern = ' \t \t \t '.repeat(50);
      const sql = `CREATE${alternatingPattern}TABLE${alternatingPattern}pattern_table (id INTEGER)`;
      
      const start = Date.now();
      const result = mockDb.execute(sql);
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeLessThan(100);
      expect(result).toEqual({ changes: 0 });
    });
  });
});