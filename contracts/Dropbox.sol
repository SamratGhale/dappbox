pragma solidity ^0.5.0;

contract Dropbox{
  string public name = 'Dropbox';
  uint public fileCount = 0;

  mapping(uint =>File) public files;

  struct File{
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint256 uploadTime,
    address payable uploader
  );

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    require(bytes(_fileHash).length > 0, "file hash invalid");
    require(bytes(_fileType).length>0,"file type invalid");
    require(bytes(_fileDescription).length > 0, "file description invalid");
    require(bytes(_fileName).length > 0, "file name invalid");
    require(msg.sender!=address(0),"uploader address invalid");
    require(_fileSize> 0,"file size invalid");

    fileCount ++;
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }
}
