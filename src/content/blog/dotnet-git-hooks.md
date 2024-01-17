---
title: "Git Hooks for .NET"
pubDatetime: 2022-05-15
description: ""
author: Daniel Proctor
featured: false
---


## Intro
When working in larger teams, It can be hard to keep a codebase in a consistent style, everyone has their own preference and may not have their IDE set up in the same way. This can lead to inconsistent code across the codebase depending on who has been working on it. In addition to this ensuring all code that gets pushed up is in a state where it can be deployed or anyone can checkout the branch with confidence that it will run without error can be hard. This is where githooks come in. We can set these up so all code that gets committed is in once consistent style and has been verified as buildable before it gets pushed up to the remote.

The javascript ecosystem has a lot of tools that people have created to manage this, such as [Husky](https://www.npmjs.com/package/husky) and [eslint](https://eslint.org/). But what about dotnet?

## Prerequisites
- [Git](https://git-scm.com/)
- [dotnet-format](https://github.com/dotnet/format)
- A .NET Core project.


## EditorConfig
[EditorConfig](https://docs.microsoft.com/en-us/visualstudio/ide/create-portable-custom-editor-options?view=vs-2022) allows you to setup coding styles used in the codebase. This is supported by many IDE's including Visual Studio and Rider. Below is a basic example provided by Microsoft. This should be saved as `.editorconfig` in the root of your Solution alongside the .sln file.

https://docs.microsoft.com/en-us/dotnet/fundamentals/code-analysis/code-style-rule-options

```
###############################
# Core EditorConfig Options   #
###############################
root = true
# All files
[*]
indent_style = space

# XML project files
[*.{csproj,vbproj,vcxproj,vcxproj.filters,proj,projitems,shproj}]
indent_size = 2

# XML config files
[*.{props,targets,ruleset,config,nuspec,resx,vsixmanifest,vsct}]
indent_size = 2

# Code files
[*.{cs,csx,vb,vbx}]
indent_size = 4
insert_final_newline = true
charset = utf-8-bom
###############################
# .NET Coding Conventions     #
###############################
[*.{cs,vb}]
# Organize usings
dotnet_sort_system_directives_first = true
# this. preferences
dotnet_style_qualification_for_field = false:silent
dotnet_style_qualification_for_property = false:silent
dotnet_style_qualification_for_method = false:silent
dotnet_style_qualification_for_event = false:silent
# Language keywords vs BCL types preferences
dotnet_style_predefined_type_for_locals_parameters_members = true:silent
dotnet_style_predefined_type_for_member_access = true:silent
# Parentheses preferences
dotnet_style_parentheses_in_arithmetic_binary_operators = always_for_clarity:silent
dotnet_style_parentheses_in_relational_binary_operators = always_for_clarity:silent
dotnet_style_parentheses_in_other_binary_operators = always_for_clarity:silent
dotnet_style_parentheses_in_other_operators = never_if_unnecessary:silent
# Modifier preferences
dotnet_style_require_accessibility_modifiers = for_non_interface_members:silent
dotnet_style_readonly_field = true:suggestion
# Expression-level preferences
dotnet_style_object_initializer = true:suggestion
dotnet_style_collection_initializer = true:suggestion
dotnet_style_explicit_tuple_names = true:suggestion
dotnet_style_null_propagation = true:suggestion
dotnet_style_coalesce_expression = true:suggestion
dotnet_style_prefer_is_null_check_over_reference_equality_method = true:silent
dotnet_style_prefer_inferred_tuple_names = true:suggestion
dotnet_style_prefer_inferred_anonymous_type_member_names = true:suggestion
dotnet_style_prefer_auto_properties = true:silent
dotnet_style_prefer_conditional_expression_over_assignment = true:silent
dotnet_style_prefer_conditional_expression_over_return = true:silent
###############################
# Naming Conventions          #
###############################
# Style Definitions
dotnet_naming_style.pascal_case_style.capitalization             = pascal_case
# Use PascalCase for constant fields  
dotnet_naming_rule.constant_fields_should_be_pascal_case.severity = suggestion
dotnet_naming_rule.constant_fields_should_be_pascal_case.symbols  = constant_fields
dotnet_naming_rule.constant_fields_should_be_pascal_case.style    = pascal_case_style
dotnet_naming_symbols.constant_fields.applicable_kinds            = field
dotnet_naming_symbols.constant_fields.applicable_accessibilities  = *
dotnet_naming_symbols.constant_fields.required_modifiers          = const
###############################
# C# Coding Conventions       #
###############################
[*.cs]
# var preferences
csharp_style_var_for_built_in_types = true:silent
csharp_style_var_when_type_is_apparent = true:silent
csharp_style_var_elsewhere = true:silent
# Expression-bodied members
csharp_style_expression_bodied_methods = false:silent
csharp_style_expression_bodied_constructors = false:silent
csharp_style_expression_bodied_operators = false:silent
csharp_style_expression_bodied_properties = true:silent
csharp_style_expression_bodied_indexers = true:silent
csharp_style_expression_bodied_accessors = true:silent
# Pattern matching preferences
csharp_style_pattern_matching_over_is_with_cast_check = true:suggestion
csharp_style_pattern_matching_over_as_with_null_check = true:suggestion
# Null-checking preferences
csharp_style_throw_expression = true:suggestion
csharp_style_conditional_delegate_call = true:suggestion
# Modifier preferences
csharp_preferred_modifier_order = public,private,protected,internal,static,extern,new,virtual,abstract,sealed,override,readonly,unsafe,volatile,async:suggestion
# Expression-level preferences
csharp_prefer_braces = true:silent
csharp_style_deconstructed_variable_declaration = true:suggestion
csharp_prefer_simple_default_expression = true:suggestion
csharp_style_pattern_local_over_anonymous_function = true:suggestion
csharp_style_inlined_variable_declaration = true:suggestion
###############################
# C# Formatting Rules         #
###############################
# New line preferences
csharp_new_line_before_open_brace = all
csharp_new_line_before_else = true
csharp_new_line_before_catch = true
csharp_new_line_before_finally = true
csharp_new_line_before_members_in_object_initializers = true
csharp_new_line_before_members_in_anonymous_types = true
csharp_new_line_between_query_expression_clauses = true
# Indentation preferences
csharp_indent_case_contents = true
csharp_indent_switch_labels = true
csharp_indent_labels = flush_left
# Space preferences
csharp_space_after_cast = false
csharp_space_after_keywords_in_control_flow_statements = true
csharp_space_between_method_call_parameter_list_parentheses = false
csharp_space_between_method_declaration_parameter_list_parentheses = false
csharp_space_between_parentheses = false
csharp_space_before_colon_in_inheritance_clause = true
csharp_space_after_colon_in_inheritance_clause = true
csharp_space_around_binary_operators = before_and_after
csharp_space_between_method_declaration_empty_parameter_list_parentheses = false
csharp_space_between_method_call_name_and_opening_parenthesis = false
csharp_space_between_method_call_empty_parameter_list_parentheses = false
# Wrapping preferences
csharp_preserve_single_line_statements = true
csharp_preserve_single_line_blocks = true
###############################
# VB Coding Conventions       #
###############################
[*.vb]
# Modifier preferences
visual_basic_preferred_modifier_order = Partial,Default,Private,Protected,Public,Friend,NotOverridable,Overridable,MustOverride,Overloads,Overrides,MustInherit,NotInheritable,Static,Shared,Shadows,ReadOnly,WriteOnly,Dim,Const,WithEvents,Widening,Narrowing,Custom,Async:suggestion
```


### IDE Settings
Within your IDE you can setup to format documents on save. This will ensure whenever you are editing new or existing files, they will be formatted according to the .editorconfig whenever the file is saved.

Rider: `File > Settings > Tools > Reformat and Cleanup Code`

Visual Studio (2022): `Tools > Options > Text Editor > Code Cleanup > Run Code Cleanup Profile on Save`


## dotnet-format
dotnet-format is a cli tool which we can use to format the code as part of the githook. Style preferences will be read from the .editorconfig file. https://github.com/dotnet/format

Installation:

`dotnet tool install -g dotnet-format`

## Githooks
At the root of the repo, there will be a .git folder. Within here there is a folder for hooks and a config file. As the idea for this is to share the hooks across the team. We will be running the hooks from a `.hooks` folder in the root of the repo. This will need to be set per user in their local git config. This can be done with:
```
git config --local core.hooksPath .hooks
```
The hooks folder can then exist in source code.

### pre-commit

`.hooks/pre-commit`
```
#!/bin/sh

FILES=$(git diff --cached --name-only --diff-filter=ACM "*.cs")
if [ -n "$FILES" ]
then
    dotnet format ./path/to/project.sln --include $FILES
    echo "$FILES" | xargs git add
fi
```
This runs on each commit and performs the following:

- Get a list of staged files where the file extension is `.cs`
- If there are any files, run dotnet format with the path to the solution and pass in the list of files.
- re-stages the formatted files ready to be committed.

Ensure that the solution path is changed to the correct path and filename.


### pre-push

`.hooks/pre-push`
```
#!/bin/sh

dotnet build "./path/to/project.sln"
dotnet test "./path/to/project.sln" --filter "Category!=Integration"
```

This will be on push and performs the following:

- Run a full build of the solution.
- Runs the unit tests for the solution where the category is not `Integration`.

Integration tests can be very long running and are best avoid during git commands. Any build errors or test failure will result in the push being rejected. Again, ensure the project path and filename are correct.

## Done
That's everything setup. It is worth noting that anyone pulling down the codebase for the first time will have to update their local gitconfig to point to the hooks folder. There are ways to automate this as a build script or as part of the .csproj Build targets, but that's for another post :).