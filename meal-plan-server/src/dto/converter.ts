/**
 * Converts a camelCase string to snake_case
 */
function camelToSnake(text: string): string {
    return text.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  
  /**
   * Converts a snake_case string to camelCase
   */
  function snakeToCamel(text: string): string {
    return text.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
  }
  
  /**
   * Converts an object with camelCase keys to an object with snake_case keys
   * @param obj The object with camelCase keys
   * @returns A new object with snake_case keys
   */
  export function toPythonFormat<T extends object>(obj: T): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = camelToSnake(key);
        const value = obj[key];
        
        // Handle nested objects recursively
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          result[snakeKey] = toPythonFormat(value);
        } else if (Array.isArray(value)) {
          // Handle arrays of objects
          result[snakeKey] = value.map(item => 
            typeof item === 'object' && item !== null ? toPythonFormat(item) : item
          );
        } else {
          result[snakeKey] = value;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Converts an object with snake_case keys to an object with camelCase keys
   * @param obj The object with snake_case keys
   * @returns A new object with camelCase keys
   */
  export function fromPythonFormat<T extends object>(obj: T): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = snakeToCamel(key);
        const value = obj[key];
        
        // Handle nested objects recursively
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          result[camelKey] = fromPythonFormat(value);
        } else if (Array.isArray(value)) {
          // Handle arrays of objects
          result[camelKey] = value.map(item => 
            typeof item === 'object' && item !== null ? fromPythonFormat(item) : item
          );
        } else {
          result[camelKey] = value;
        }
      }
    }
    
    return result;
  }
  
  // Example usage:
  // const userProfile = {
  //   userId: "123456",
  //   age: 30,
  //   heightCm: 165,
  //   nestedObject: {
  //     someProperty: "value",
  //     anotherProperty: 42
  //   },
  //   arrayOfObjects: [
  //     { firstName: "John", lastName: "Doe" },
  //     { firstName: "Jane", lastName: "Smith" }
  //   ]
  // };
  
  // Convert to Python format (snake_case)
  // const pythonFormat = toPythonFormat(userProfile);
  // console.log(pythonFormat);
  // Output:
  // {
  //   user_id: "123456",
  //   age: 30,
  //   height_cm: 165,
  //   nested_object: {
  //     some_property: "value",
  //     another_property: 42
  //   },
  //   array_of_objects: [
  //     { first_name: "John", last_name: "Doe" },
  //     { first_name: "Jane", last_name: "Smith" }
  //   ]
  // }
  
  // Convert back to camelCase
  // const camelCaseFormat = fromPythonFormat(pythonFormat);
  // console.log(camelCaseFormat);
  // Output: Original userProfile object