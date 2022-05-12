# React Router Hooks with  Typescript (test driven)

## Requirements

- [ ] Profiles
  - [ ] Display all profiles
  - [ ] Add a profile
  - [ ] Remove a profile
  - [ ] Navigate to tasks associated with a particular profile
- [ ] Tasks
  - [ ] Display all tasks for a particular profile
  - [ ] Add a task
  - [ ] Mark a task as complete
  - [ ] Clear all completed tasks
  - [ ] Navigate to profiles
- [ ] Summary
  - [ ] Display the total number of profiles
  - [ ] Display the total number of tasks
  - [ ] Be visible on every page
  - [ ] Immediately update as the underlying data changes
- [ ] Navigation
  - [ ] Profiles and Tasks are displayed on different pages
  - [ ] Bookmarked pages should work
  - [ ] Back button should work

## Setup, Build, Test and Run
* Dependencies
  * start local database via webdb project 
    * https://gitlab.cj.dev/training/webdb
* Build
  * ./scripts/build.sh 
* Testing
  * Unit Tests
    * **Note:** 'REQUIREMENT:' pattern can be used to search for tests for various current requirements
    * ./scripts/test.sh
  * Test coverage
    * **Notes:** this is not showing 100% test coverage which is on purpose. i am not really using it, but it's here to let others give it a try.
   * ./scripts/coverage.sh
* Setup sample data
  * **Note** This sample data contains all the current requirements for this exercise as of April 2022. This might not be the case in the future and you can check the requirements above.
  * ./scripts/sample-data.sh
* Run app
  * ./scripts/run.sh

## React app setup
* https://create-react-app.dev/docs/adding-typescript/
    * from parent directory
        * npx create-react-app <app-name-here> --template typescript
    * Notes
      * css
        * import css at top of component files to have it be included
      * npm
        * versions suggestions as of 3/29/22 
          * react-router-dom 
            * use 5.3.0 because of a breaking change in version 6
          * history (as of 3/29/22)
            * use 4.10.1 because of a breaking change in 5.3.0
        * build 
          * does 'tree shaking' which trims dependency bloat by only pulling in functions that you use from dependencies rather than everything
            * from Jason
        * Already using typescript
          * 'history' 
            * re: https://www.npmjs.com/package/@types/history
          * 'web-vitals'
            * re: https://www.npmjs.com/package/web-vitals#types
          * @testing-library/react
            * re: https://www.npmjs.com/package/@types/testing-library__react
          * @testing-library/user-event
            * re: https://www.npmjs.com/package/@types/testing-library__user-event

## Typescript related notes
### types
  * Basic types - https://www.typescriptlang.org/docs/handbook/basic-types.html#table-of-contents
    * boolean
    * Boolean
      * falsy/truth works as expected with Boolean('value')
      * Unexpected behaviour with Boolean.apply('value')
        * Boolean.apply('value') or Boolean.apply('value', [0]) => false
        * Boolean.apply('value', [x]) (x = 1 | 2 | 3 | 100) => true
    * number types
      * number - float point value
      * bigint
    * string - single or double quotes
      * string interpolation 
        ``` 
          const name = 'world'
          const helloWorld: string = `hello ${name}` 
        ```
      * String.apply('value', [])
    * array
      * `let list: number[] = [1, 2, 3];`
      * `let list: Array<number> = [1, 2, 3];`
    * enum
      * reverseMap is way to get string value for enum
        * `const north = CompassDirections.North; const northStringViaRevserMap = CompassDirections[north]; expect(northStringViaRevserMap).toBe("North")`
    * Map deconstruction
      * see code in ./prototype/
        * ```describe('learn destructuring', ....)```
      * If you want basic js deconstruction then transform map to an 'any'
      * If you want to have proper typing on values you need to create an interface or type with specific types
        * `exploreDestructuring.test.ts`
        * simple example:
        ```
           interface AB {
              a: number
              b: string
           };
           const {a, b} = {} as AB
           type CD = {
              c: number
              d: string
           }
           const {c, d} = {} as CD
        ```
    * Tuple
      * Intellij auto generate type for tuple is not very clean. Tuple generated type shows as an array rather than a tuple which is because under the covers in Typescript a tuple is an array with 2 elements.
        * `const c = ["c", 3]`
        * with correct type should be:
          * `const c: [string, number] = ["c", 3]`
        * but Intellij generates:
          * `const c: (string | number)[] = ["c", 3]`
          * 
### isolatedModules behavior
* Short version: 
  * This behaviour is a way to limit the scope of the variable in files to a local scope without explicit imports/exports
* Requires all files must be modules
  * documentation 
    * https://www.typescriptlang.org/tsconfig#isolatedModules
  * modules
    * https://www.typescriptlang.org/docs/handbook/modules.html
  * tsconfig.json is point of config
  * "fix" for Intellij warning/error that does Not block execution is to add an empty export or import ie
      ``` 
      import ''
      const code = console.log("using empty import to limit scope")
      ```
      ```
      const code = console.log("using empty export to limit scope")
      export {}
      ```
    
### Typescript file extensions differences 
  * .ts files contains only pure TypeScript
  * .tsx have included JSX also.
    * If you want to use a generically typed function in a .tsx file you need to extend the type declaration with something to make it clear that that part of the code is not a JSX element
      * examples
        * issue: 
          * `const createInFuture: <T>(f: T) => Promise<T> = <T>(f: T) => Promise.resolve(f)`
          * compiler sees `<T>` as a JSX element
        * possible fixes
          * `const createInFuture: <T extends unknown>(f: T) => Promise<T> = <T extends unknown>(f: T) => Promise.resolve(f)`
          * `const createInFuture: <T,>(f: T) => Promise<T> = <T,>(f: T) => Promise.resolve(f)`
          
### Testing concepts that can save time 
* useEffect
  * Need to use async act() to make sure all the data is resolved before doing expect checks
    ```
    let rendered: RenderResult = {} as RenderResult
    await act( async () => {
        rendered = render(element)
    })
    expect(rendered.getByText('Whatever_Here')).toBeInTheDocument()
    ```
* When rendering components of type RenderResult you can see the value via debug method: 
   ```
    let container: RenderResult = render(component)
    container.debug()
  ```
* To save time I used this method of typing to Not have to deal with unimplemented checks after rendering. It removes need to do a undefined check for each subsequent expect(...).to* .
  * Requires subsequent undefined checks
    ```
      const element: JSX.Element = <div/>
      let rendered: RenderResult
      await act( async () => {
          rendered = render(element)
      })
      if ( typeof rendered !== 'undefined') {
        expect(rendered.getByText('Whatever_Here')).toBeInTheDocument()
      }
      ```
  * Vs no subsequent checks required
    ```
      const element: JSX.Element = <div/>
      let rendered: RenderResult = {} as RenderResult
      await act( async () => {
          rendered = render(element)
      })
      expect(rendered.getByText('Whatever_Here')).toBeInTheDocument()
      ```
