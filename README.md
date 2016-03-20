# metaform

Metaform was developed to 'scratch an itch' - to reduce the time it takes to build a functional user interface, mainly due to the time it takes to create forms to edit data, and grids to list, search and select data. Most developers can create a set of HTML forms fairly quickly, but it takes time to develop professional and tested forms with usable controls such as search within drop-down lists, and asynchronous data fetching. Yet forms and grids are pretty standard. Pagination...check. Validation and alerts...check, and so on.

Forms are also inextricably linked to the data model. In the early phases of a new project, as the data model evolves then so to must the user interface, resulting in frequent changes that slow down development and shift focus from the core service to aligning elements on the screen, so the quality of the service logic is reflected in the quality of the user interface.

In the early 'naughties', I used a framework called Apache Cocoon, which I found tremendously productive. Forms were defined using XSLT, and JavaScript hooks to enable interactivity. XML was the business back then, and once you got used to XSLT, its pattern matching was a powerful way to build reusable user interface components.

Time has moved on and interest has shifted to JSON. Therefore, I settled on JSON Schema to define forms declaratively in a similar way that Cocoon used XML to describe forms. There were a few frameworks around when I looked in earnest about a year ago. I wanted an updated implementation for JavaScript 'single page applications', preferably using React. I favour React over  frameworks such as Backbone and Angular for improved composition of nested UI elements.

The schema has been extended to support implementation-specific properties such as specifying that a text field should use a textarea instead of a text input control.

An example of a schema is:

    {
      "schema": {
        "id": "$baseurl/form-schemas/feature-family",
        "$schema": "http://json-schema.org/schema#",
        "name": "Feature Family",
        "description": "Schema for a Feature Family",
        "type": "object",
        "properties": {
          "name": {
            "title": "Name",
            "description": "Feature Family name",
            "type": "string"
          },
          "description": {
            "title": "Description",
            "description": "Feature Type description",
            "type": "string"
          },
          "wideTableName": {
            "title": "Wide Table Name",
            "description": "Wide Table Name",
            "type": "string"
          }
        }
      },
      "form": {
        "description": {
          "type": "textarea"
        }
      }
    }

Everything under the 'schema' key adheres to the JSON Schema standard. Elements under 'form' are specific to this framework.

The framework expects to call:

* an API service to negotiate the data model
* a Forms API service (could be the same API service) that serves Form schemas as above

See the 'formsapi' repository for an implementation of the Forms API Server.

