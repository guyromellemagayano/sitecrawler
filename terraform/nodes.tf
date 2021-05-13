resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQChk0K1+V5UHIc2fccXq0jit2q37mQkqQy6/SLDpmqGJtwOrC5fqBAW9+CNjvnbgc/GupwgSG3kNpWWQTRD6sNSd5b+kmejts72yq9d2/jONbZxevv72e/Xqo9VK8YljjJwQ7TYOEXYY/EHbh39IUWj7QYs4Q145slvl/82TL2iYJB109HzY+AsFd0wYOyx6PFuz+6YAFwvZtE8oNwg26LxbtBSRtn2jn+78BPzZ6tQC9CtcinURFH65btD7ThK66Hmv/OpuDu5UWJeqIxkvaz/1cSMsrXjEDkhtgGPbFyjdP3uM/Ap2AvFPKVB2bPj6V7NYdd+aRTePJA7oZvJzbhBsF4tp/AkFfFBxxfQTIY4D2Gz0I0rc4N8vPZ0WeG2gz+J1gU3EPqtN+d7zFvIl382nyvKCeMl9nSdXFGE52w9LvyVKmX3flj7ODhbnNfnnO2wzl6yk9TywDgnJInNR+vIt/fT3kr0bdDoZ6vO2oW8/XyTWQAPyCo5PCrUBPYHFRJ77GPhWARQpAn9J+5U0IjO6pB7562UPkuCkRpcrwR6yeItkcKhZaPnYAEahaeVZQ2S5ixLX/F2VEFEaJoXJUnRiVSog7jKjy45yq0t+DDV9AsFZy5HkJTAlVLPEvy5qK4zFRitbVAusjgb3SXQhtRSO689csokCsUVDYctDO9i0Q== deployer"
}

resource "aws_instance" "staging" {
  ami           = "ami-068663a3c619dd892"
  instance_type = "t2.small"
	security_groups = ["${aws_security_group.node_security_group.name}"]
	key_name = aws_key_pair.deployer.key_name
	iam_instance_profile = aws_iam_instance_profile.staging.name

	root_block_device {
		volume_size = 20
	}

  tags = {
    Name = "Staging"
		Env = "staging"
  }
}

resource "aws_eip" "staging_up" {
  instance = aws_instance.staging.id
}

resource "aws_instance" "production" {
  ami           = "ami-068663a3c619dd892"
  instance_type = "t3.micro"
	security_groups = ["${aws_security_group.production.name}"]
	key_name = aws_key_pair.deployer.key_name
	iam_instance_profile = aws_iam_instance_profile.production.name

	root_block_device {
		volume_size = 20
	}

  tags = {
    Name = "Production ${count.index + 1}"
		Env = "production"
  }

	count = 2
}
