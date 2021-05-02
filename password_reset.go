package passwordreset

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"strings"
	"time"
var MinTokenLength = authcookie.MinLength

var (
	ErrMalformedToken = errors.New("malformed token")
	ErrExpiredToken   = errors.New("token expired")
	ErrWrongSignature = errors.New("wrong token signature")
)

func getUserSecretKey(pwdval, secret []byte) []byte {
	m := hmac.New(sha256.New, secret)
	m.Write(pwdval)
	return m.Sum(nil)
}
func getSignature(b []byte, secret []byte) []byte {
	keym := hmac.New(sha256.New, secret)
	keym.Write(b)
	m := hmac.New(sha256.New, keym.Sum(nil))
	m.Write(b)
	return m.Sum(nil)
}
func NewToken(login string, dur time.Duration, pwdval, secret []byte) string {
	sk := getUserSecretKey(pwdval, secret)
	return authcookie.NewSinceNow(login, dur, sk)
}

func NewTokenNoPadding(login string, dur time.Duration, pwdval, secret []byte) string {
	sk := getUserSecretKey(pwdval, secret)
	return authcookie.NewSinceNowNoPadding(login, dur, sk)
}func VerifyToken(token string, pwdvalFn func(string) ([]byte, error), secret []byte) (login string, err error) {
	encoding := base64.RawURLEncoding
	// 
	if strings.LastIndexByte(token, '=') != -1 {
		encoding = base64.URLEncoding
	}
	blen := encoding.DecodedLen(len(token))
	if blen <= 4+32 {
		err = ErrMalformedToken
		return
	}
	b := make([]byte, blen)
	blen, err = encoding.Decode(b, []byte(token))
	if err != nil {
		return
	}
	// 
	// 
	if blen <= 4+32 {
		err = ErrMalformedToken
		return
	}
	b = b[:blen]

	data := b[:blen-32]
	exp := time.Unix(int64(binary.BigEndian.Uint32(data[:4])), 0)
	if exp.Before(time.Now()) {
		err = ErrExpiredToken
		return
	}
	login = string(data[4:])
	pwdval, err := pwdvalFn(login)
	if err != nil {
		login = ""
		return
	}
	sig := b[blen-32:]
	sk := getUserSecretKey(pwdval, secret)
	realSig := getSignature(data, sk)
	if subtle.ConstantTimeCompare(realSig, sig) != 1 {
		err = ErrWrongSignature
		return
	}
	return
}