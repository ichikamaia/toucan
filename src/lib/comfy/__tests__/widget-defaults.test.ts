import { describe, expect, it } from "vitest"
import type { InputSlot, NodeSchema } from "../objectInfo"
import { buildWidgetDefaults } from "../widget-defaults"

const createInput = (overrides: Partial<InputSlot>): InputSlot => ({
  name: "test_input",
  group: "required",
  rawType: "STRING",
  options: [],
  config: null,
  supportsWidget: true,
  forceInput: false,
  ...overrides,
})

const createSchema = (inputs: InputSlot[]): NodeSchema => ({
  name: "TestNode",
  displayName: "Test Node",
  description: "A test node",
  category: "Test",
  inputs,
  outputs: [],
  isOutputNode: false,
  searchValue: "test",
})

describe("buildWidgetDefaults", () => {
  it("should return empty object if schema is undefined", () => {
    expect(buildWidgetDefaults(undefined)).toEqual({})
  })

  it("should return empty object if schema has no inputs", () => {
    const schema = createSchema([])
    expect(buildWidgetDefaults(schema)).toEqual({})
  })

  it("should return defaults for primitive types", () => {
    const inputs = [
      createInput({
        name: "int_input",
        valueType: "INT",
        config: { default: 42 },
      }),
      createInput({
        name: "float_input",
        valueType: "FLOAT",
        config: { default: 3.14 },
      }),
      createInput({
        name: "bool_input",
        valueType: "BOOLEAN",
        config: { default: true },
      }),
      createInput({
        name: "string_input",
        valueType: "STRING",
        config: { default: "default text" },
      }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({
      int_input: 42,
      float_input: 3.14,
      bool_input: true,
      string_input: "default text",
    })
  })

  it("should return defaults for select/combo inputs", () => {
    const inputs = [
      createInput({
        name: "select_input",
        options: ["A", "B", "C"],
        config: { default: "B" },
      }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({
      select_input: "B",
    })
  })

  it("should use first option as default if no default config is provided for select", () => {
    const inputs = [
      createInput({
        name: "select_no_default",
        options: ["X", "Y", "Z"],
        config: {},
      }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({
      select_no_default: "X",
    })
  })

  it("should fallback to safe defaults if config is missing", () => {
    const inputs = [
      createInput({ name: "int_input", valueType: "INT", config: null }),
      createInput({ name: "string_input", valueType: "STRING", config: null }),
      createInput({ name: "bool_input", valueType: "BOOLEAN", config: null }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({
      int_input: 0,
      string_input: "",
      bool_input: false,
    })
  })

  it("should ignore inputs that do not support widgets", () => {
    const inputs = [
      createInput({
        name: "model_input",
        valueType: "MODEL",
        supportsWidget: false,
      }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({})
  })

  it("should ignore inputs with forceInput: true", () => {
    const inputs = [
      createInput({
        name: "forced_input",
        valueType: "INT",
        config: { default: 10 },
        supportsWidget: true,
        forceInput: true,
      }),
    ]
    const schema = createSchema(inputs)
    const defaults = buildWidgetDefaults(schema)

    expect(defaults).toEqual({})
  })
})
