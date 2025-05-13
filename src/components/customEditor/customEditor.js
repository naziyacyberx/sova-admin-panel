


import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function CustomEditor({ value, onChange }) {
  const editorRef = useRef(null);

  return (
    <div style={{ padding: '0px', position: 'relative', zIndex: 1 }}>
      <Editor
        apiKey="5by9fde8l3erxp8am0hhvs624yvs5whhbyyzmbsd8uunx616"
        // apiKey="zlaxb389iunicji2ajezpuumllvyqiuj3md82s6ru3zf414e"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          setTimeout(() => editor.focus(), 200);
        }}
        value={value}
        onEditorChange={(newValue) => {
          onChange(newValue);
        }}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link image media | removeformat | help',

          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',

          // Enable image upload from device
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.onchange = function () {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  const base64 = reader.result.toString();
                  callback(base64, { alt: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },

          content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              caret-color: black;
            }
          `
        }}
      />
    </div>
  );
}


// import React, { useRef } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// export default function CustomEditor({ value, onChange }) {
//   const editorRef = useRef(null);

//   return (
//     <div style={{ padding: '0px', position: 'relative', zIndex: 1 }}>
//       <Editor
//         apiKey="zlaxb389iunicji2ajezpuumllvyqiuj3md82s6ru3zf414e"
//         onInit={(_evt, editor) => {
//           editorRef.current = editor;
//           setTimeout(() => editor.focus(), 200);
//         }}
//         value={value}
//         onEditorChange={(newValue) => {
//           onChange(newValue);
//         }}
//         init={{
//           height: 400,
//           menubar: true,
//           plugins: [
//             'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
//             'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
//             'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
//           ],
//           toolbar:
//             'undo redo | blocks | ' +
//             'bold italic forecolor | alignleft aligncenter ' +
//             'alignright alignjustify | bullist numlist outdent indent | ' +
//             'removeformat | help',
//           content_style: `
//             body {
//               font-family: Helvetica, Arial, sans-serif;
//               font-size: 14px;
//               caret-color: black;
//             }
//           `
//         }}
//       />
//     </div>
//   );
// }
