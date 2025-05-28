<?php
$host='localhost';
$user='root';
$pass='';
$db='student';

$conn=new mysqli($host,$user,$pass,$db);
//echo 'Connection Success...<br>';

$id=$_POST['cid'];
$cna=$_POST['cna'];
$cfe=$_POST['cfe'];
$cad=$_POST['cad'];

$sql="update stud set  s_name='$cna',s_con='$cfe',s_add='$cad' where s_id='$id'";

$res=$conn->query($sql);

if($res==TRUE)
{
    echo 'Data updation Success...';
}
else 
{
    echo 'Error1...';
}

$conn->close();
?>
