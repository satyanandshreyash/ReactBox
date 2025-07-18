import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import FileIcon from "../atoms/FileIcon";
import { getFileExtension } from "../../utils/getFileExtension";
import { useEditorSocketStore } from "../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../store/folderContextMenuStore";

const TreeNode = ({ fileFolderData }) => {
  const [visibility, setVisibility] = useState({});
  const { editorSocket } = useEditorSocketStore();

  const { setFile, setIsOpen, setX, setY } = useFileContextMenuStore();
  const { setFolder, setFolderIsOpen, setFolderX, setFolderY } =
    useFolderContextMenuStore();

  function toggleVisibility(name) {
    setVisibility({
      ...visibility,
      [name]: !visibility[name],
    });
  }
  const handleDoubleClick = (fileFolderData) => {
    // console.log("Double clicked on: ", fileFolderData);
    editorSocket.emit("readFile", { path: fileFolderData.path });
  };

  const handleContextMenuForFolder = (e, path) => {
    e.preventDefault();
    setFolder(path);
    setFolderIsOpen(true);
    setFolderX(e.clientX);
    setFolderY(e.clientY);
  };

  const handleContextMenuForFile = (e, path) => {
    e.preventDefault();
    setFile(path);
    setIsOpen(true);
    setX(e.clientX);
    setY(e.clientY);
  };

  return (
    fileFolderData && (
      <div className="ml-3 border-gray-400">
        {fileFolderData.children ? (
          <button
            className="text-[hsl(0,0%,90%)] flex items-center gap-1 cursor-pointer outline-none hover:bg-[hsl(0,0%,20%)] px-2 w-full"
            onClick={() => toggleVisibility(fileFolderData.name)}
            onContextMenu={(e) =>
              handleContextMenuForFolder(e, fileFolderData.path)
            }
          >
            {visibility[fileFolderData.name] ? (
              <div className="flex items-center">
                <IoIosArrowDown size={18} />
                <FcOpenedFolder size={18} />
              </div>
            ) : (
              <div className="flex">
                <IoIosArrowForward size={18} />
                <FcFolder size={18} />
              </div>
            )}
            {fileFolderData.name}
          </button>
        ) : (
          <button
            className="text-[hsl(0,0%,90%)] ml-5 flex items-center gap-2 cursor-pointer outline-none hover:bg-[hsl(0,0%,20%)] px-2 w-full"
            onContextMenu={(e) =>
              handleContextMenuForFile(e, fileFolderData.path)
            }
            onDoubleClick={() => {
              handleDoubleClick(fileFolderData);
            }}
          >
            <FileIcon extension={getFileExtension(fileFolderData.name)} />
            {fileFolderData.name}
          </button>
        )}
        {visibility[fileFolderData.name] &&
          fileFolderData.children &&
          fileFolderData.children.map((child) => (
            <TreeNode fileFolderData={child} key={child.name} />
          ))}
      </div>
    )
  );
};

export default TreeNode;
