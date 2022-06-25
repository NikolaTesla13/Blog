---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import { Code } from "astro/components";
title: The graphics pipeline in Vulkan
publishDate: 25 Jun 2022
description: Exploring the process of creating one and how it works.
heroImage: /pipeline-banner.png
alt: Hero Image
---

Vulkan is primarily known as being an explicit low level graphics api, that requires a lot of boilerplate. While most of that is true, it comes to our advantage allowing a very deep configuration of all the driver code. One of the main parts of a graphical application is the graphics pipeline, which describes the steps a GPU has to do to achieve our desired result. The input consists of data and programs and the output is represented by the pixels on the screen. 

# Stages

There are two primary types of functions: fixed and shaders. The input assembler, rasterization and color blending are fixed, we can just provide a bunch of arguments to tweak them. The vertex and pixel (fragment) shaders are programable, we can write the full code for them. 


Input Assembler -> Vertex Shader -> Tessellation Shader -> Rasterization -> Pixel Shader -> Color Blending -> Framebuffer

# Shaders

Shaders are programs written in GLSL or HLSL. They're being run for every vertex to specifiy its attributes, such as color or position. The vertex shader specifies the position of each vertex and it passes down data to the pixel shader, which calculates the color of each pixel. An example of a simple HLSL vertex shader for Vulkan:

```cpp
struct VSInput {
    [[vk::location(0)]] float3 Pos : POSITION0;
    [[vk::location(1)]] float3 Color : COLOR0;
};

struct UBO {
    float4x4 projectionMatrix;
    float4x4 modelMatrix;
    float4x4 viewMatrix;
};

cbuffer ubo : register(b0) { UBO ubo; }

struct VSOutput {
    float4 Pos : SV_POSITION;
    [[vk::location(0)]] float3 Color : COLOR0;
};

VSOutput main(VSInput input) {
    VSOutput output = (VSOutput)0;
    output.Color = input.Color;
    output.Pos = mul(ubo.projectionMatrix, 
        mul(ubo.viewMatrix, mul(ubo.modelMatrix, 
        float4(input.Pos.xyz, 1.0))));
    return output;
}
```

And the corresponding pixel shader: 
```cpp
float4 main([[vk::location(0)]] float3 Color : COLOR0) : SV_TARGET {
  return float4(Color, 1.0);
}
```

Here you can see some basic syntax, such as specifying location, structs or functions. You can learn more about Vulkan shaders in the Vulkan Samples [repo](https://github.com/SaschaWillems/Vulkan/tree/master/data/shaders) from Sascha Willems.

After writing the shader code, you need to compile each program to a binary format such as spirv, which can be read from Vulkan: 
```cpp
std::vector<char> code; // read from the binary file

VkShaderModuleCreateInfo createInfo { 
    .sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO,
    .codeSize = code.size(),
    .pCode = reinterpret_cast<const uint32_t*>(code.data())
};

VkShaderModule shaderModule;
if (vkCreateShaderModule(device, &createInfo, nullptr, &shaderModule) != VK_SUCCESS) {
    throw std::runtime_error("Failed to create shader module!");
}
```

Now, to actually use the shaders we need to create a `VkPipelineShaderStageCreateInfo` struct, to specify all the required details: 
```cpp
VkPipelineShaderStageCreateInfo vertexStageInfo { 
    .sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO,
    .stage = VK_SHADER_STAGE_VERTEX_BIT, // specify the stage
    .module = vertexModule, 
    .pName = "main" // the entry point function
}; 

// same for pixelStageInfo

VkPipelineShaderStageCreateInfo shaderStages[] = {vertexStageInfo, pixelStageInfo};
```

And that's all for shaders! Of course things can get a lot more complicated, such as mesh shaders or compute shaders, but these two stages (vertex and pixel) are required.

# Fixed stages

Sidenote: I want to start by discussing what each stage does and what important informations are related to it, because of that I won't provide code (you can copy paste that from anywhere online).

- Vertex Input: it describes the format of the vertex data, before it's passed to the vertex shader. There are two ways to define this: bindings and attributes.
    - Bindings have three fields: binding (the binding number the structure defines), stride (space between elements of the vertex buffer) and the input rate (tells whether the function is run per vertex of per instance index)
    - Attributes have location and binding (similar), format (the vertex format) and the offset

- Input Assembler: takes the raw vertex and index data from the buffers to prepare the inputs for the vertex shader. The two main arguments of it are what kind of geometry will be drawn and if the primitive restart should be enabled. Some common topolgies are: 
    - VK_PRIMITIVE_TOPOLOGY_POINT_LIST
    - VK_PRIMITIVE_TOPOLOGY_LINE_LIST
    - VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST (most likeyly use this one)

- Viewport: what region of the framebuffer will be rendered to. Almost everytime it will be from (0, 0) to (width, height), with the min depth as 0 and the max depth as 1,

- Rasterizer: takes in the geometry shaped as vertices and outputs the pixels. It can perform depth testing, face culling and wireframe rendering. Common attributes of it are: 
    - depthClampEnable: fragments that are beyond the near and far planes are clamped to them as opposed to discarding them. This is useful in some special cases like shadow maps.
    - rasterizerDiscardEnable: disables the output to the framebuffer.
    - polygonMode: VK_POLYGON_MODE_FILL, VK_POLYGON_MODE_LINE or VK_POLYGON_MODE_POINT. 
    - cullMode: which types of face culling to use (VK_CULL_MODE_BACK_BIT)

# Pipeline layout

Here you can specify shader uniforms or push constants. It's basically a layout for dynamic data sent to the shaders.

```cpp
VkPipelineLayoutCreateInfo pipelineLayoutInfo {
    .sType = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO,
    .setLayoutCount = 0,
    .pSetLayouts = nullptr, 
    .pushConstantRangeCount = 0,
    .pPushConstantRanges = nullptr
};

if (vkCreatePipelineLayout(device, &pipelineLayoutInfo, nullptr, 
    &pipelineLayout) != VK_SUCCESS) {
    throw std::runtime_error("Failed to create pipeline layout!");
}
```

# Conclusion

Yeah there's a lot of code to set up the render pipeline, but all of this control is worth it, in the end. You can also check out the official docs to explore all of the possible arguments for the fixed functions.